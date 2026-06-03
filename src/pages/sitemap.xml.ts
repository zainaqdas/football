import { TVTVHDScraper } from '../../scraper/src/index.js';
import { withCache } from '../lib/cache.ts';

export async function GET({ url }: { url: URL }) {
  const scraper = new TVTVHDScraper();
  const SITE_URL = url.origin;
  const CACHE_TTL = 60_000; // 60 seconds

  try {
    const [allChannels, categories] = await Promise.all([
      withCache('channels.all', CACHE_TTL, () => scraper.getAllChannels()),
      withCache('channels.categories', CACHE_TTL, () => scraper.getCategories()),
    ]);

    const today = new Date().toISOString().split('T')[0];

    // Build URLs
    const urls: string[] = [];

    // Static pages
    urls.push(`
  <url>
    <loc>${SITE_URL}/</loc>
    <changefreq>hourly</changefreq>
    <priority>1.0</priority>
  </url>`);

    urls.push(`
  <url>
    <loc>${SITE_URL}/channels</loc>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>`);

    urls.push(`
  <url>
    <loc>${SITE_URL}/events</loc>
    <changefreq>hourly</changefreq>
    <priority>0.8</priority>
  </url>`);

    // Category pages
    for (const cat of categories) {
      const slug = cat.toLowerCase();
      urls.push(`
  <url>
    <loc>${SITE_URL}/channels/${encodeURIComponent(slug)}</loc>
    <changefreq>hourly</changefreq>
    <priority>0.7</priority>
  </url>`);
    }

    // Channel/stream pages
    for (const ch of allChannels) {
      const streamId = ch.streamUrl?.split('stream=')[1]?.split('&')[0];
      if (streamId) {
        urls.push(`
  <url>
    <loc>${SITE_URL}/stream/${encodeURIComponent(streamId)}</loc>
    <changefreq>hourly</changefreq>
    <priority>0.8</priority>
  </url>`);
      }
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('')}
</urlset>`;

    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=300, s-maxage=300',
      },
    });
  } catch {
    // Fallback: serve minimal sitemap with static pages
    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <changefreq>hourly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE_URL}/channels</loc>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${SITE_URL}/events</loc>
    <changefreq>hourly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;

    return new Response(fallbackXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=300, s-maxage=300',
      },
    });
  }
}
