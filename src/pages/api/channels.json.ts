import type { APIRoute } from 'astro';
import { TVTVHDScraper } from '../../../scraper/src/index.js';

export const GET: APIRoute = async ({ url }) => {
  const scraper = new TVTVHDScraper();
  const category = url.searchParams.get('category');
  const search = url.searchParams.get('q');
  const active = url.searchParams.get('active');

  try {
    let channels;
    
    if (category) {
      channels = await scraper.getChannelsByCategoryName(category);
      if (!channels) {
        return new Response(JSON.stringify({ error: 'Category not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    } else if (search) {
      channels = await scraper.searchChannels(search);
    } else {
      channels = await scraper.getAllChannels();
    }

    if (active === 'true') {
      channels = channels.filter((c: any) => c.isActive);
    }

    const stats = await scraper.getChannelStats();

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
