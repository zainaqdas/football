import type { APIRoute } from 'astro';
import { TVTVHDScraper } from '../../../scraper/src/index.js';
import { withCache } from '../../../src/lib/cache.ts';

const CACHE_TTL = 30_000; // 30 seconds for channel data

export const GET: APIRoute = async ({ url }) => {
  const scraper = new TVTVHDScraper();
  const category = url.searchParams.get('category');
  const search = url.searchParams.get('q');
  const active = url.searchParams.get('active');

  try {
    // Cache the full channel list and stats, then filter in memory
    const allChannels = await withCache('channels.all', CACHE_TTL, () => scraper.getAllChannels());
    const stats = await withCache('channels.stats', CACHE_TTL, () => scraper.getChannelStats());

    let channels = allChannels;

    if (category) {
      const normalized = category.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      channels = allChannels.filter((c: any) =>
        c.category.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() === normalized
      );
      if (channels.length === 0) {
        return new Response(JSON.stringify({ error: 'Category not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    } else if (search) {
      const q = search.toLowerCase();
      channels = allChannels.filter((c: any) =>
        c.name.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      );
    }

    if (active === 'true') {
      channels = channels.filter((c: any) => c.isActive);
    }

    return new Response(JSON.stringify({
      channels,
      stats,
      total: channels.length,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
