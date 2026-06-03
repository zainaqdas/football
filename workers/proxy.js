/**
 * HLS Proxy Worker for Cloudflare
 *
 * Proxies .m3u8 playlists and .ts segments from the CDN (fubohd.com/tvtvhd.com)
 * with the correct Referer/Origin headers so the CDN accepts the request.
 * Rewrites relative segment URLs in the m3u8 to go through this worker.
 *
 * Deploy: npx wrangler deploy
 *
 * Usage:
 *   https://hls-proxy.<your-subdomain>.workers.dev/?url=https://cdn.com/stream.m3u8?token=abc
 */

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const targetUrl = url.searchParams.get('url');

    if (!targetUrl) {
      return new Response('Missing "url" query parameter', { status: 400 });
    }

    try {
      const response = await fetch(targetUrl, {
        headers: {
          'Referer': 'https://tvtvhd.com/',
          'Origin': 'https://tvtvhd.com',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': '*/*',
        },
      });

      if (!response.ok) {
        return new Response(`Upstream error: ${response.status}`, {
          status: response.status,
        });
      }

      const contentType = response.headers.get('content-type') || '';
      const body = await response.arrayBuffer();

      // For m3u8 playlists: rewrite relative segment URLs to go through this worker
      if (contentType.includes('m3u8') || targetUrl.includes('.m3u8')) {
        const text = new TextDecoder().decode(body);
        const baseUrl = targetUrl.substring(0, targetUrl.lastIndexOf('/') + 1);
        const workerUrl = `${url.protocol}//${url.host}${url.pathname}?url=`;

        const rewritten = text
          .split('\n')
          .map((line) => {
            const trimmed = line.trim();
            // Skip HLS tags, comments, and empty lines
            if (trimmed.startsWith('#') || trimmed === '') return line;
            // If it's already going through a proxy, skip rewriting
            if (trimmed.startsWith(workerUrl)) return line;
            // If it's a relative URL, resolve against the base and proxy it
            if (!trimmed.startsWith('http')) {
              const resolved = new URL(trimmed, baseUrl).href;
              return workerUrl + encodeURIComponent(resolved);
            }
            // Absolute URLs: proxy them as well
            return workerUrl + encodeURIComponent(trimmed);
          })
          .join('\n');

        return new Response(rewritten, {
          headers: {
            'Content-Type': 'application/vnd.apple.mpegurl; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-cache',
          },
        });
      }

      // For segments and other binary content: proxy directly with CORS headers
      return new Response(body, {
        headers: {
          'Content-Type': contentType || 'application/octet-stream',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Expose-Headers': 'Content-Length, Content-Range',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    } catch (e) {
      return new Response(`Proxy error: ${e.message}`, { status: 502 });
    }
  },
};
