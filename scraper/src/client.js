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

export class FetchError extends Error {
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
export async function fetchPage(path, options = {}) {
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
export async function fetchJSON(path, options = {}) {
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
export async function fetchJSONWithCacheBust(path, options = {}) {
  const separator = path.includes('?') ? '&' : '?';
  const cacheBustedPath = `${path}${separator}_=${Date.now()}`;
  return fetchJSON(cacheBustedPath, options);
}

/**
 * Fetch the main status.json from tvtvhd.com
 * @returns {Promise<object>} Status data with channels grouped by category
 */
export async function fetchStatusJSON() {
  return fetchJSONWithCacheBust(`${BASE_DOMAIN}/status.json`);
}

/**
 * Fetch the diaries/events JSON from pltvhd.com
 * @returns {Promise<object>} Events/schedule data
 */
export async function fetchDiariesJSON() {
  return fetchJSON(`${API_DOMAIN}/diaries.json`, {
    headers: {
      'Referer': `${BASE_DOMAIN}/eventos/`,
      'Origin': BASE_DOMAIN,
    },
  });
}

export { BASE_DOMAIN, API_DOMAIN };
