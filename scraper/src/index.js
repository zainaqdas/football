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

import * as channels from './channels.js';
import * as events from './events.js';
import * as streams from './streams.js';
import { fetchPage, fetchStatusJSON, fetchDiariesJSON, BASE_DOMAIN, API_DOMAIN } from './client.js';

export class TVTVHDScraper {
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
    return channels.getChannelsByCategory();
  }

  /** Get all channels as a flat list */
  async getAllChannels() {
    return channels.getAllChannels();
  }

  /** Get only active channels */
  async getActiveChannels() {
    return channels.getActiveChannels();
  }

  /** Get channels by category name */
  async getChannelsByCategoryName(name) {
    return channels.getChannelsByCategoryName(name);
  }

  /** Get all category names */
  async getCategories() {
    return channels.getCategories();
  }

  /** Search channels by name or category */
  async searchChannels(query) {
    return channels.searchChannels(query);
  }

  /** Get channel statistics */
  async getChannelStats() {
    return channels.getChannelStats();
  }

  // ─── Events ─────────────────────────────────────────

  /** Get all events from the schedule */
  async getAllEvents() {
    return events.getAllEvents();
  }

  /** Get events by date (YYYY-MM-DD) */
  async getEventsByDate(dateStr) {
    return events.getEventsByDate(dateStr);
  }

  /** Get today's events */
  async getTodaysEvents() {
    return events.getTodaysEvents();
  }

  /** Get events by country */
  async getEventsByCountry(countryName) {
    return events.getEventsByCountry(countryName);
  }

  /** Search events by description or country */
  async searchEvents(query) {
    return events.searchEvents(query);
  }

  /** Get event statistics */
  async getEventStats() {
    return events.getEventStats();
  }

  // ─── Streams ────────────────────────────────────────

  /** Get stream info from a stream page URL */
  async getStreamInfo(streamUrl) {
    return streams.getStreamInfo(streamUrl);
  }

  /** Get multiple stream infos with concurrency control */
  async getMultipleStreamInfo(streamUrls, concurrency = 3) {
    return streams.getMultipleStreamInfo(streamUrls, concurrency);
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
const defaultScraper = new TVTVHDScraper();
export default defaultScraper;
export { channels, events, streams };
