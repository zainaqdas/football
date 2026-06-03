/**
 * Events/Schedule Scraper
 * Extracts sports events, schedules, and embed links from the diaries API
 * Source: https://pltvhd.com/diaries.json (Strapi CMS)
 */

import { fetchDiariesJSON, BASE_DOMAIN } from './client.js';

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
export async function getAllEvents() {
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
export async function getEventsByDate(dateStr) {
  const events = await getAllEvents();
  return events.filter(event => event.date === dateStr);
}

/**
 * Get today's events
 * @returns {Promise<Array<object>>}
 */
export async function getTodaysEvents() {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  return getEventsByDate(today);
}

/**
 * Get events for a specific country
 * @param {string} countryName - Country name (e.g., "Argentina", "Mexico")
 * @returns {Promise<Array<object>>}
 */
export async function getEventsByCountry(countryName) {
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
export async function searchEvents(query) {
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
export async function getEventStats() {
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
