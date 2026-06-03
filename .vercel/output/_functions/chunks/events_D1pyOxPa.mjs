import { T as TVTVHDScraper } from './index_-JAiwH9B.mjs';

const GET = async ({ url }) => {
  const scraper = new TVTVHDScraper();
  const date = url.searchParams.get("date");
  const country = url.searchParams.get("country");
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
      total: events.length
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
