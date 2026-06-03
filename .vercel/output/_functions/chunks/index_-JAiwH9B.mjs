/**
 * HTTP Client for tvtvhd.com scraper
 * Handles fetching with proper headers, retries, and error handling
 */

const DEFAULT_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
  'Accept-Encoding': 'gzip, deflate, br',
  'Referer': 'https://tvtvhd.com/',
  'Origin': 'https://tvtvhd.com',
  'DNT': '1',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Sec-Fetch-User': '?1',
};

const JSON_HEADERS = {
  ...DEFAULT_HEADERS,
  'Accept': 'application/json, text/plain, */*',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'same-origin',
};

const BASE_DOMAIN = 'https://tvtvhd.com';
const API_DOMAIN = 'https://pltvhd.com';

class FetchError extends Error {
  constructor(message, status, url) {
    super(message);
    this.name = 'FetchError';
    this.status = status;
    this.url = url;
  }
}

const DEFAULT_TIMEOUT = 30000; // 30 seconds

/**
 * Fetch with timeout using AbortController
 */
async function fetchWithTimeout(url, options = {}, timeoutMs = DEFAULT_TIMEOUT) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Fetch HTML page with browser-like headers
 * @param {string} path - URL path or full URL
 * @param {object} options - Additional fetch options
 * @returns {Promise<string>} HTML content
 */
async function fetchPage(path, options = {}) {
  const url = path.startsWith('http') ? path : `${BASE_DOMAIN}${path}`;
  const headers = { ...DEFAULT_HEADERS, ...options.headers };

  const response = await fetchWithTimeout(url, {
    headers,
    redirect: 'follow',
    ...options,
  });

  if (!response.ok) {
    throw new FetchError(
      `Failed to fetch ${url}: ${response.status} ${response.statusText}`,
      response.status,
      url
    );
  }

  return response.text();
}

/**
 * Fetch JSON data with proper headers
 * @param {string} path - URL path or full URL
 * @param {object} options - Additional fetch options
 * @returns {Promise<object>} Parsed JSON data
 */
async function fetchJSON(path, options = {}) {
  const url = path.startsWith('http') ? path : `${BASE_DOMAIN}${path}`;
  const headers = { ...JSON_HEADERS, ...options.headers };

  const response = await fetchWithTimeout(url, {
    headers,
    redirect: 'follow',
    ...options,
  });

  if (!response.ok) {
    throw new FetchError(
      `Failed to fetch JSON from ${url}: ${response.status} ${response.statusText}`,
      response.status,
      url
    );
  }

  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error(`Invalid JSON from ${url}: ${e.message}`);
  }
}

/**
 * Fetch JSON with cache-busting timestamp
 * @param {string} path - URL path or full URL
 * @returns {Promise<object>} Parsed JSON data
 */
async function fetchJSONWithCacheBust(path, options = {}) {
  const separator = path.includes('?') ? '&' : '?';
  const cacheBustedPath = `${path}${separator}_=${Date.now()}`;
  return fetchJSON(cacheBustedPath, options);
}

/**
 * Fetch the main status.json from tvtvhd.com
 * @returns {Promise<object>} Status data with channels grouped by category
 */
async function fetchStatusJSON() {
  return fetchJSONWithCacheBust(`${BASE_DOMAIN}/status.json`);
}

/**
 * Fetch the diaries/events JSON from pltvhd.com
 * @returns {Promise<object>} Events/schedule data
 */
async function fetchDiariesJSON() {
  return fetchJSON(`${API_DOMAIN}/diaries.json`, {
    headers: {
      'Referer': `${BASE_DOMAIN}/eventos/`,
      'Origin': BASE_DOMAIN,
    },
  });
}

/**
 * Channels Scraper
 * Extracts all channels, categories, and stream links from status.json
 */


/**
 * Get all channels grouped by category from tvtvhd.com
 * @returns {Promise<Array<{category: string, channels: Array<object>}>>}
 */
async function getChannelsByCategory() {
  const data = await fetchStatusJSON();
  const categories = [];

  for (const [categoryName, channels] of Object.entries(data)) {
    categories.push({
      category: categoryName,
      channels: channels.map(ch => ({
        name: ch.Canal,
        status: ch.Estado,
        streamUrl: ch.Link,
        isActive: ch.Estado?.toLowerCase() === 'activo',
      })),
      totalChannels: channels.length,
      activeChannels: channels.filter(ch => ch.Estado?.toLowerCase() === 'activo').length,
    });
  }

  return categories;
}

/**
 * Get all channels as a flat list
 * @returns {Promise<Array<{category: string, name: string, status: string, streamUrl: string, isActive: boolean}>>}
 */
async function getAllChannels() {
  const data = await fetchStatusJSON();
  const allChannels = [];

  for (const [categoryName, channels] of Object.entries(data)) {
    for (const ch of channels) {
      allChannels.push({
        category: categoryName,
        name: ch.Canal,
        status: ch.Estado,
        streamUrl: ch.Link,
        isActive: ch.Estado?.toLowerCase() === 'activo',
      });
    }
  }

  return allChannels;
}

/**
 * Get all active channels only
 * @returns {Promise<Array<object>>}
 */
async function getActiveChannels() {
  const all = await getAllChannels();
  return all.filter(ch => ch.isActive);
}

/**
 * Get channels by specific category
 * @param {string} categoryName - Category name (e.g., "ARGENTINA", "MÉXICO", "ESPAÑA")
 * @returns {Promise<Array<object>|null>}
 */
// Normalize accented characters for comparison (e.g., "mexico" matches "MÉXICO")
function normalize(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

async function getChannelsByCategoryName(categoryName) {
  const data = await fetchStatusJSON();
  const normalizedInput = normalize(categoryName);
  const key = Object.keys(data).find(
    k => normalize(k) === normalizedInput
  );

  if (!key) return null;

  return data[key].map(ch => ({
    name: ch.Canal,
    status: ch.Estado,
    streamUrl: ch.Link,
    isActive: ch.Estado?.toLowerCase() === 'activo',
  }));
}

/**
 * Get all available categories
 * @returns {Promise<Array<string>>}
 */
async function getCategories() {
  const data = await fetchStatusJSON();
  return Object.keys(data);
}

/**
 * Search channels by name
 * @param {string} query - Search query
 * @returns {Promise<Array<object>>}
 */
async function searchChannels(query) {
  const all = await getAllChannels();
  const lowerQuery = query.toLowerCase();
  return all.filter(ch =>
    ch.name.toLowerCase().includes(lowerQuery) ||
    ch.category.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get summary/statistics of all channels
 * @returns {Promise<object>}
 */
async function getChannelStats() {
  const categories = await getChannelsByCategory();
  const all = await getAllChannels();

  return {
    totalCategories: categories.length,
    totalChannels: all.length,
    totalActive: all.filter(ch => ch.isActive).length,
    totalInactive: all.filter(ch => !ch.isActive).length,
    categories: categories.map(c => ({
      name: c.category,
      total: c.totalChannels,
      active: c.activeChannels,
    })),
  };
}

/**
 * Events/Schedule Scraper
 * Extracts sports events, schedules, and embed links from the diaries API
 * Source: https://pltvhd.com/diaries.json (Strapi CMS)
 */


/**
 * Decode the base64-encoded 'r' parameter from embed URLs
 * @param {string} base64Str - Base64 encoded string
 * @returns {string|null} Decoded string or null
 */
function decodeEmbedParam(base64Str) {
  try {
    // Handle URL-safe base64 (where - replaces + and _ replaces /)
    const normalized = base64Str.replace(/-/g, '+').replace(/_/g, '/');
    // Add padding if needed
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    const decoded = Buffer.from(padded, 'base64').toString('utf-8');
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Parse embed iframe URL to extract parameters
 * @param {string} embedIframe - Embed iframe URL (e.g., "/embed/eventos.html?r=BASE64")
 * @returns {{ url: string, decodedParams: object|null, rawEmbedUrl: string }}
 */
function parseEmbedIframe(embedIframe) {
  if (!embedIframe) return { url: null, decodedParams: null, rawEmbedUrl: null };

  const fullUrl = embedIframe.startsWith('http')
    ? embedIframe
    : `${BASE_DOMAIN}${embedIframe}`;

  let decodedParams = null;
  try {
    const urlObj = new URL(fullUrl, BASE_DOMAIN);
    const rParam = urlObj.searchParams.get('r');
    if (rParam) {
      const decoded = decodeEmbedParam(rParam);
      if (decoded) {
        try {
          decodedParams = JSON.parse(decoded);
        } catch {
          decodedParams = { raw: decoded };
        }
      }
    }
  } catch {
    // URL parsing failed
  }

  return {
    url: fullUrl,
    decodedParams,
    rawEmbedUrl: embedIframe,
  };
}

/**
 * Get all events from the schedule
 * @returns {Promise<Array<object>>}
 */
async function getAllEvents() {
  const data = await fetchDiariesJSON();
  
  if (!data?.data || !Array.isArray(data.data)) {
    return [];
  }

  return data.data.map(event => {
    const attrs = event.attributes || {};
    const embedsData = attrs.embeds?.data || [];
    const countryData = attrs.country?.data?.attributes || null;
    const countryImage = countryData?.image?.data?.attributes || null;

    return {
      id: event.id,
      description: attrs.diary_description,
      hour: attrs.diary_hour,
      date: attrs.date_diary,
      createdAt: attrs.createdAt,
      updatedAt: attrs.updatedAt,
      publishedAt: attrs.publishedAt,
      country: countryData ? {
        name: countryData.name,
        flag: countryImage ? {
          url: countryImage.url?.startsWith('http')
            ? countryImage.url
            : `https://cdn.ftvhd.com${countryImage.url}`,
          width: countryImage.width,
          height: countryImage.height,
          mime: countryImage.mime,
          size: countryImage.size,
        } : null,
      } : null,
      embeds: embedsData.map(embed => ({
        id: embed.id,
        name: embed.attributes?.embed_name,
        iframe: parseEmbedIframe(embed.attributes?.embed_iframe),
      })),
    };
  });
}

/**
 * Get events for a specific date
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 * @returns {Promise<Array<object>>}
 */
async function getEventsByDate(dateStr) {
  const events = await getAllEvents();
  return events.filter(event => event.date === dateStr);
}

/**
 * Get today's events
 * @returns {Promise<Array<object>>}
 */
async function getTodaysEvents() {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  return getEventsByDate(today);
}

/**
 * Get events for a specific country
 * @param {string} countryName - Country name (e.g., "Argentina", "Mexico")
 * @returns {Promise<Array<object>>}
 */
async function getEventsByCountry(countryName) {
  const events = await getAllEvents();
  const lowerQuery = countryName.toLowerCase();
  return events.filter(
    event => event.country?.name?.toLowerCase() === lowerQuery
  );
}

/**
 * Search events by description
 * @param {string} query - Search term
 * @returns {Promise<Array<object>>}
 */
async function searchEvents(query) {
  const events = await getAllEvents();
  const lowerQuery = query.toLowerCase();
  return events.filter(event =>
    event.description?.toLowerCase().includes(lowerQuery) ||
    event.country?.name?.toLowerCase().includes(lowerQuery) ||
    event.embeds?.some(embed => embed.name?.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Get event schedule summary/statistics
 * @returns {Promise<object>}
 */
async function getEventStats() {
  const events = await getAllEvents();

  // Group by date
  const byDate = {};
  for (const event of events) {
    const dateKey = event.date || 'unknown';
    if (!byDate[dateKey]) byDate[dateKey] = [];
    byDate[dateKey].push(event);
  }

  // Group by country
  const byCountry = {};
  for (const event of events) {
    const countryKey = event.country?.name || 'unknown';
    if (!byCountry[countryKey]) byCountry[countryKey] = [];
    byCountry[countryKey].push(event);
  }

  const uniqueDates = Object.keys(byDate).sort();
  const uniqueCountries = Object.keys(byCountry).sort();

  return {
    totalEvents: events.length,
    uniqueDates,
    uniqueCountries,
    eventsByDate: Object.entries(byDate)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, evts]) => ({
        date,
        count: evts.length,
        events: evts.map(e => ({
          id: e.id,
          description: e.description,
          hour: e.hour,
          country: e.country?.name,
        })),
      })),
    eventsByCountry: Object.entries(byCountry)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([country, evts]) => ({
        country,
        count: evts.length,
      })),
  };
}

/**
 * Streams Scraper
 * Extracts stream information from individual stream pages
 * Stream URL pattern: https://tvtvhd.com/vivo/canales.php?stream=[stream_id]
 */


/**
 * Extract stream ID from a stream URL
 * @param {string} streamUrl - Full stream URL
 * @returns {string|null} Stream ID or null
 */
function extractStreamId(streamUrl) {
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
async function getStreamInfo(streamUrl) {
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
async function getMultipleStreamInfo(streamUrls, concurrency = 3) {
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

/**
 * tvtvhd.com Scraper API
 * Main entry point - provides a unified API for all scraping operations
 *
 * Endpoints discovered:
 *   - /status.json          -> Channels grouped by region (11 categories)
 *   - https://pltvhd.com/diaries.json -> Sports events/schedule (Strapi CMS)
 *   - /vivo/canales.php?stream=[id]   -> Individual stream pages
 *   - /eventos/             -> Sports agenda page
 *   - /embed/eventos.html?r=[base64]  -> Embed pages
 *   - ?s={search}           -> Search
 *   - https://cdn.ftvhd.com -> CDN for images
 */


class TVTVHDScraper {
  constructor(options = {}) {
    this.options = {
      baseDomain: BASE_DOMAIN,
      apiDomain: API_DOMAIN,
      ...options,
    };
  }

  // ─── Channels ────────────────────────────────────────

  /** Get all channels grouped by category */
  async getChannelsByCategory() {
    return getChannelsByCategory();
  }

  /** Get all channels as a flat list */
  async getAllChannels() {
    return getAllChannels();
  }

  /** Get only active channels */
  async getActiveChannels() {
    return getActiveChannels();
  }

  /** Get channels by category name */
  async getChannelsByCategoryName(name) {
    return getChannelsByCategoryName(name);
  }

  /** Get all category names */
  async getCategories() {
    return getCategories();
  }

  /** Search channels by name or category */
  async searchChannels(query) {
    return searchChannels(query);
  }

  /** Get channel statistics */
  async getChannelStats() {
    return getChannelStats();
  }

  // ─── Events ─────────────────────────────────────────

  /** Get all events from the schedule */
  async getAllEvents() {
    return getAllEvents();
  }

  /** Get events by date (YYYY-MM-DD) */
  async getEventsByDate(dateStr) {
    return getEventsByDate(dateStr);
  }

  /** Get today's events */
  async getTodaysEvents() {
    return getTodaysEvents();
  }

  /** Get events by country */
  async getEventsByCountry(countryName) {
    return getEventsByCountry(countryName);
  }

  /** Search events by description or country */
  async searchEvents(query) {
    return searchEvents(query);
  }

  /** Get event statistics */
  async getEventStats() {
    return getEventStats();
  }

  // ─── Streams ────────────────────────────────────────

  /** Get stream info from a stream page URL */
  async getStreamInfo(streamUrl) {
    return getStreamInfo(streamUrl);
  }

  /** Get multiple stream infos with concurrency control */
  async getMultipleStreamInfo(streamUrls, concurrency = 3) {
    return getMultipleStreamInfo(streamUrls, concurrency);
  }

  // ─── Raw Data ───────────────────────────────────────

  /** Fetch raw status.json data */
  async getRawStatusJSON() {
    return fetchStatusJSON();
  }

  /** Fetch raw diaries.json data */
  async getRawDiariesJSON() {
    return fetchDiariesJSON();
  }

  /** Fetch a raw HTML page */
  async getPage(path) {
    return fetchPage(path);
  }

  // ─── Combined Data ─────────────────────────────────

  /**
   * Get a complete dump of all data from the site
   */
  async getAllData() {
    const [channelData, eventData] = await Promise.all([
      this.getAllChannels(),
      this.getAllEvents(),
    ]);

    return {
      scrapedAt: new Date().toISOString(),
      channels: {
        total: channelData.length,
        active: channelData.filter(c => c.isActive).length,
        items: channelData,
      },
      events: {
        total: eventData.length,
        items: eventData,
      },
    };
  }
}

// Default instance
new TVTVHDScraper();

export { TVTVHDScraper as T, extractStreamId as e };
