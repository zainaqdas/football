import type { APIRoute } from 'astro';
import { TVTVHDScraper } from '../../../scraper/src/index.js';
import { withCache } from '../../../src/lib/cache.ts';

const CACHE_TTL = 60_000; // 60 seconds for event data

export const GET: APIRoute = async ({ url }) => {
  const scraper = new TVTVHDScraper();
  const date = url.searchParams.get('date');
  const country = url.searchParams.get('country');

  try {
    const allEvents = await withCache('events.all', CACHE_TTL, () => scraper.getAllEvents());
    const stats = await withCache('events.stats', CACHE_TTL, () => scraper.getEventStats());

    let events = allEvents;

    if (date) {
      events = allEvents.filter((e: any) => e.date === date);
    } else if (country) {
      const q = country.toLowerCase();
      events = allEvents.filter((e: any) => e.country?.name?.toLowerCase() === q);
    }

    return new Response(JSON.stringify({
      events,
      stats,
      total: events.length,
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
