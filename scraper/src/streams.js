/**
 * Streams Scraper
 * Extracts stream information from individual stream pages
 * Stream URL pattern: https://tvtvhd.com/vivo/canales.php?stream=[stream_id]
 */

import { fetchPage, BASE_DOMAIN } from './client.js';

/**
 * Extract stream ID from a stream URL
 * @param {string} streamUrl - Full stream URL
 * @returns {string|null} Stream ID or null
 */
export function extractStreamId(streamUrl) {
  try {
    // Handle relative URLs by providing a base
    const urlObj = streamUrl.startsWith('http') 
      ? new URL(streamUrl) 
      : new URL(streamUrl, 'https://tvtvhd.com');
    return urlObj.searchParams.get('stream');
  } catch {
    return null;
  }
}

/**
 * Fetch and parse a stream page
 * @param {string} streamUrl - The stream page URL
 * @returns {Promise<object>} Parsed stream data
 */
export async function getStreamInfo(streamUrl) {
  const html = await fetchPage(streamUrl);
  const streamId = extractStreamId(streamUrl);

  // Max HTML size to process (1MB) to prevent performance issues
  const htmlToProcess = html.slice(0, 1_000_000);

  // Extract iframe sources (these often contain the actual video player)
  const iframeRegex = /<iframe[^>]*src=["']([^"']+)["'][^>]*>/gi;
  const iframes = [];
  let match;
  while ((match = iframeRegex.exec(htmlToProcess)) !== null) {
    iframes.push({
      src: match[1],
      fullUrl: match[1].startsWith('http') ? match[1] : `${BASE_DOMAIN}${match[1]}`,
    });
  }

  // Extract all script tags with sources
  const scriptRegex = /<script[^>]*src=["']([^"']+)["'][^>]*>/gi;
  const scripts = [];
  while ((match = scriptRegex.exec(htmlToProcess)) !== null) {
    scripts.push(match[1]);
  }

  // Extract all links
  const linkRegex = /<a[^>]*href=["']([^"']+)["'][^>]*>/gi;
  const links = [];
  while ((match = linkRegex.exec(htmlToProcess)) !== null) {
    const href = match[1];
    if (!href.startsWith('#') && !href.startsWith('javascript:')) {
      links.push({
        url: href,
        fullUrl: href.startsWith('http') ? href : `${BASE_DOMAIN}${href}`,
      });
    }
  }

  // Extract meta information
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i);

  // Extract any m3u8 URLs (HLS streams)
  const m3u8Regex = /https?:\/\/[^"'\s<>]+\.m3u8[^"'\s<>]*/gi;
  const m3u8Urls = [];
  while ((match = m3u8Regex.exec(htmlToProcess)) !== null) {
    m3u8Urls.push(match[0]);
  }

  // Look for potential video sources in inline scripts using string-based parsing
  const videoSources = [];
  const scriptParts = htmlToProcess.split('</script>');
  for (const part of scriptParts) {
    const scriptContent = part.includes('<script') 
      ? part.substring(part.indexOf('>') + 1) 
      : part;
    
    // Look for embedded player URLs
    const sourceRegex = /(?:src|source|url|file)\s*[:=]\s*["']([^"']+(?:m3u8|mp4|ts)[^"']*)["']/gi;
    while ((match = sourceRegex.exec(scriptContent)) !== null) {
      videoSources.push(match[1]);
    }
  }

  return {
    streamId,
    streamUrl,
    title: titleMatch ? titleMatch[1].trim() : null,
    description: descMatch ? descMatch[1].trim() : null,
    iframes,
    scripts,
    links,
    hlsStreams: [...new Set([...m3u8Urls, ...videoSources])],
    rawHtmlSize: html.length,
  };
}

/**
 * Batch fetch stream info for multiple streams
 * @param {Array<string>} streamUrls - Array of stream URLs
 * @param {number} concurrency - Number of concurrent requests (default: 3)
 * @returns {Promise<Array<object>>}
 */
export async function getMultipleStreamInfo(streamUrls, concurrency = 3) {
  const results = [];
  const chunks = [];

  // Split into chunks for concurrency control
  for (let i = 0; i < streamUrls.length; i += concurrency) {
    chunks.push(streamUrls.slice(i, i + concurrency));
  }

  for (const chunk of chunks) {
    const chunkResults = await Promise.allSettled(
      chunk.map(url => getStreamInfo(url))
    );
    results.push(...chunkResults.map((r, i) => ({
      url: chunk[i],
      success: r.status === 'fulfilled',
      data: r.status === 'fulfilled' ? r.value : null,
      error: r.status === 'rejected' ? r.reason.message : null,
    })));
  }

  return results;
}
