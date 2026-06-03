import * as streams from '../scraper/src/streams.js';
import scraper from '../scraper/src/index.js';

const channels = await scraper.getAllChannels();
const active = channels.filter(c => c.isActive);
const channel = active[0];
console.log('Channel:', channel.name);

const info = await streams.getStreamInfo(channel.streamUrl);
const hlsUrl = info.hlsStreams?.[0];
if (!hlsUrl) { console.log('No HLS URL'); process.exit(1); }

console.log('HLS URL:', hlsUrl);

const proxyUrl = `https://futbollleague.vercel.app/api/hls-proxy?url=${encodeURIComponent(hlsUrl)}`;
console.log('Proxy URL:', proxyUrl);

// First request - test headers
console.log('\n=== Request 1 (expect MISS) ===');
const r1 = await fetch(proxyUrl);
console.log('Status:', r1.status, r1.ok ? '✅' : '❌');
console.log('x-vercel-cache:', r1.headers.get('x-vercel-cache') || '(none)');
console.log('cache-control:', r1.headers.get('cache-control') || '(none)');
console.log('age:', r1.headers.get('age') || '(none)');
console.log('content-type:', r1.headers.get('content-type') || '(none)');
console.log('content-length:', r1.headers.get('content-length') || '(none)');

if (!r1.ok) {
  const err = await r1.text();
  console.log('Error:', err.slice(0, 200));
  process.exit(1);
}

const text1 = await r1.text();
const isM3u8 = text1.startsWith('#EXTM3U');
console.log('Is valid m3u8:', isM3u8 ? '✅' : '❌');
if (isM3u8) {
  const lines = text1.split('\n').filter(l => l.trim() && !l.startsWith('#'));
  console.log('Segment URLs found:', lines.length);
  console.log('First segment URL:', lines[0]?.slice(0, 100));
}

// Wait and make second request
console.log('\n=== Request 2 (expect HIT) ===');
await new Promise(r => setTimeout(r, 1500));
const r2 = await fetch(proxyUrl);
console.log('Status:', r2.status, r2.ok ? '✅' : '❌');
console.log('x-vercel-cache:', r2.headers.get('x-vercel-cache') || '(none)');
console.log('age:', r2.headers.get('age') || '(none)');
console.log('cache-control:', r2.headers.get('cache-control') || '(none)');

// Summary
console.log('\n=== SUMMARY ===');
console.log('Proxy works:', r1.ok && r2.ok ? '✅ Yes' : '❌ No');
console.log('Cache-Control has s-maxage:', (r1.headers.get('cache-control') || '').includes('s-maxage') ? '✅ Yes' : '❌ No');
console.log('CDN Cache HIT:', r2.headers.get('x-vercel-cache') === 'HIT' ? '✅ Yes' : '⚠️ Not yet (may need more requests)');
console.log('Valid HLS playlist:', isM3u8 ? '✅ Yes' : '❌ No');
