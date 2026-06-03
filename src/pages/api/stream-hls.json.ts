import type { APIRoute } from 'astro';
import { TVTVHDScraper } from '../../../scraper/src/index.js';
import { withCache } from '../../../src/lib/cache.ts';

const CHANNELS_TTL = 30_000; // 30 seconds
const STREAM_TTL = 10_000;    // 10 seconds (streams change frequently)

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
    const allChannels = await withCache('channels.all', CHANNELS_TTL, () => scraper.getAllChannels());
    const channel = allChannels.find((ch: any) => {
      const sid = ch.streamUrl?.split('stream=')[1]?.split('&')[0];
      return sid === streamId;
    });

    if (!channel) {
      return new Response(JSON.stringify({ error: 'Channel not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const streamInfo = await withCache(
      `stream.${channel.streamUrl}`,
      STREAM_TTL,
      () => scraper.getStreamInfo(channel.streamUrl),
    );
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
