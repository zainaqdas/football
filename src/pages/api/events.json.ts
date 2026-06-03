import type { APIRoute } from 'astro';
import { TVTVHDScraper } from '../../../scraper/src/index.js';

export const GET: APIRoute = async ({ url }) => {
  const scraper = new TVTVHDScraper();
  const date = url.searchParams.get('date');
  const country = url.searchParams.get('country');

  try {
    let events;
    
    if (date) {
      events = await scraper.getEventsByDate(date);
    } else if (country) {
      events = await scraper.getEventsByCountry(country);
    } else {
      events = await scraper.getAllEvents();
    }

    const stats = await scraper.getEventStats();

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
