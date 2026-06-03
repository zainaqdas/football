import type { APIRoute } from 'astro';
import { TVTVHDScraper } from '../../../scraper/src/index.js';

export const GET: APIRoute = async ({ url }) => {
  const streamId = url.searchParams.get('stream');
  if (!streamId) {
    return new Response(JSON.stringify({ error: 'Missing stream parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const scraper = new TVTVHDScraper();

  try {
    // Find the channel
    const allChannels = await scraper.getAllChannels();
    const channel = allChannels.find(ch => {
      const sid = ch.streamUrl?.split('stream=')[1]?.split('&')[0];
      return sid === streamId;
    });

    if (!channel) {
      return new Response(JSON.stringify({ error: 'Channel not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get the stream info (HLS URL)
    const streamInfo = await scraper.getStreamInfo(channel.streamUrl);
    const hlsUrl = streamInfo?.hlsStreams?.[0] || null;

    return new Response(JSON.stringify({
      streamId,
      channelName: channel.name,
      category: channel.category,
      isActive: channel.isActive,
      streamUrl: channel.streamUrl,
      hlsUrl,
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
