/**
 * Channels Scraper
 * Extracts all channels, categories, and stream links from status.json
 */

import { fetchStatusJSON, BASE_DOMAIN } from './client.js';

/**
 * Get all channels grouped by category from tvtvhd.com
 * @returns {Promise<Array<{category: string, channels: Array<object>}>>}
 */
export async function getChannelsByCategory() {
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
export async function getAllChannels() {
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
export async function getActiveChannels() {
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

export async function getChannelsByCategoryName(categoryName) {
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
export async function getCategories() {
  const data = await fetchStatusJSON();
  return Object.keys(data);
}

/**
 * Search channels by name
 * @param {string} query - Search query
 * @returns {Promise<Array<object>>}
 */
export async function searchChannels(query) {
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
export async function getChannelStats() {
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
