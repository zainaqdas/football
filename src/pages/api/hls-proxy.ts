import type { APIRoute } from 'astro';

const REFERER = 'https://tvtvhd.com/';
const ORIGIN = 'https://tvtvhd.com';

/**
 * Proxy endpoint for HLS streams.
 * Fetches .m3u8 playlists and .ts segments with the correct Referer/Origin headers
 * so the streaming server (fubohd.com) doesn't reject the request with 403.
 *
 * Usage:
 *   /api/hls-proxy?url=https://example.com/stream.m3u8?token=abc
 */
export const GET: APIRoute = async ({ url }) => {
  const targetUrl = url.searchParams.get('url');
  if (!targetUrl) {
    return new Response('Missing url parameter', { status: 400 });
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'Referer': REFERER,
        'Origin': ORIGIN,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.5',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'cross-site',
      },
    });

    if (!response.ok) {
      return new Response(`Upstream error: ${response.status}`, {
        status: response.status,
      });
    }

    const contentType = response.headers.get('content-type') || '';
    const body = await response.arrayBuffer();

    // If it's an m3u8 playlist, rewrite segment URLs to go through the proxy
    if (contentType.includes('m3u8') || targetUrl.includes('.m3u8')) {
      const text = new TextDecoder().decode(body);
      const baseUrl = targetUrl.substring(0, targetUrl.lastIndexOf('/') + 1);
      const proxyBase = '/api/hls-proxy?url=';

      const rewritten = text.split('\n').map(line => {
        const trimmed = line.trim();
        // Skip comments, empty lines, and tags
        if (trimmed.startsWith('#') || trimmed === '') return line;
        // If line is a URL (relative or absolute), proxy it
        if (!trimmed.startsWith('http')) {
          // Relative URL - resolve against base
          const resolved = new URL(trimmed, baseUrl).href;
          return proxyBase + encodeURIComponent(resolved);
        }
        return proxyBase + encodeURIComponent(trimmed);
      }).join('\n');

      return new Response(rewritten, {
        headers: {
          'Content-Type': 'application/vnd.apple.mpegurl; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache',
        },
      });
    }

    // For .ts segments and other binary content, proxy directly
    return new Response(body, {
      headers: {
        'Content-Type': contentType || 'application/octet-stream',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600',
      },
    });

  } catch (e: any) {
    return new Response(`Proxy error: ${e.message}`, { status: 502 });
  }
};
