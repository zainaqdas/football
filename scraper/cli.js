#!/usr/bin/env node

/**
 * CLI for tvtvhd.com Scraper
 * Usage:
 *   node cli.js                    - Show help
 *   node cli.js channels           - List all channels
 *   node cli.js channels:active    - List only active channels
 *   node cli.js channels:<category> - List channels by category
 *   node cli.js categories         - List all categories
 *   node cli.js events             - List all events
 *   node cli.js events:today       - List today's events
 *   node cli.js events:<country>   - List events by country
 *   node cli.js search:<query>     - Search channels
 *   node cli.js stats              - Get statistics
 *   node cli.js all                - Get all data
 *   node cli.js stream:<url>       - Get stream info
 *   node cli.js raw:status         - Get raw status.json
 *   node cli.js raw:diaries        - Get raw diaries.json
 */

import { TVTVHDScraper } from './src/index.js';

const scraper = new TVTVHDScraper();

function formatTime(dateStr) {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleString();
}

async function showChannels(channels) {
  if (channels.length === 0) {
    console.log('No channels found.');
    return;
  }

  console.log(`\nFound ${channels.length} channels:\n`);
  console.log('─'.repeat(80));
  console.log('  CATEGORY'.padEnd(25), 'CHANNEL'.padEnd(30), 'STATUS'.padEnd(12), 'STREAM');
  console.log('─'.repeat(80));

  for (const ch of channels) {
    const status = ch.isActive ? 'ACTIVE' : 'INACTIVE';
    console.log(
      `  ${(ch.category || '').padEnd(22)}`,
      `${(ch.name || '').padEnd(28)}`,
      `${status.padEnd(10)}`,
      ch.streamUrl || 'N/A'
    );
  }
  console.log('─'.repeat(80));
}

async function showEvents(events) {
  if (events.length === 0) {
    console.log('No events found.');
    return;
  }

  console.log(`\nFound ${events.length} events:\n`);
  console.log('─'.repeat(100));
  console.log('  DATE'.padEnd(14), 'HOUR'.padEnd(8), 'COUNTRY'.padEnd(16), 'DESCRIPTION'.padEnd(40), 'EMBEDS');
  console.log('─'.repeat(100));

  for (const ev of events) {
    const embedsStr = ev.embeds?.map(e => e.name || '?').join(', ') || 'none';
    console.log(
      `  ${(ev.date || 'N/A').padEnd(12)}`,
      `${(ev.hour || 'N/A').padEnd(6)}`,
      `${(ev.country?.name || 'N/A').padEnd(14)}`,
      `${(ev.description || '').substring(0, 38).padEnd(38)}`,
      embedsStr
    );
  }
  console.log('─'.repeat(100));
}

async function showStats() {
  const [channelStats, eventStats] = await Promise.all([
    scraper.getChannelStats(),
    scraper.getEventStats(),
  ]);

  console.log('\n╔═════════════════════════════════════════╗');
  console.log('║           TVTVHD SCRAPER STATS          ║');
  console.log('╚═════════════════════════════════════════╝\n');

  console.log('📺 CHANNELS');
  console.log(`   Total Channels: ${channelStats.totalChannels}`);
  console.log(`   Active: ${channelStats.totalActive}`);
  console.log(`   Inactive: ${channelStats.totalInactive}`);
  console.log(`   Categories: ${channelStats.totalCategories}`);
  console.log('\n   By Category:');
  for (const cat of channelStats.categories) {
    const bar = '█'.repeat(Math.round((cat.active / Math.max(...channelStats.categories.map(c => c.active))) * 20));
    console.log(`   ${cat.name.padEnd(16)} ${cat.active}/${cat.total} ${bar}`);
  }

  console.log('\n📅 EVENTS');
  console.log(`   Total Events: ${eventStats.totalEvents}`);
  console.log(`   Unique Dates: ${eventStats.uniqueDates.length}`);
  console.log(`   Unique Countries: ${eventStats.uniqueCountries.length}`);

  if (eventStats.uniqueDates.length > 0) {
    console.log('\n   By Date:');
    for (const d of eventStats.eventsByDate.slice(0, 10)) {
      console.log(`   ${d.date}  ${d.count} event(s)`);
    }
  }
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'help';

  try {
    switch (true) {
      case command === 'help' || command === '--help' || command === '-h':
        console.log(`
╔══════════════════════════════════════════════════╗
║         TVTVHD.COM SCRAPER - COMMANDS           ║
╚══════════════════════════════════════════════════╝

  channels              List all channels
  channels:active       List active channels only
  channels:<category>   List channels by category
  categories            List all categories
  events                List all events
  events:today          List today's events
  events:<country>      List events by country
  search:<query>        Search channels
  stats                 Show statistics
  all                   Get all data
  stream:<url>          Get stream info
  raw:status            Get raw status.json
  raw:diaries           Get raw diaries.json
  help                  Show this help
`);
        break;

      case command === 'channels':
        const allChannels = await scraper.getAllChannels();
        await showChannels(allChannels);
        break;

      case command === 'channels:active':
        const activeChannels = await scraper.getActiveChannels();
        await showChannels(activeChannels);
        break;

      case command.startsWith('channels:'):
        const categoryName = command.split(':')[1];
        const catChannels = await scraper.getChannelsByCategoryName(categoryName);
        if (!catChannels) {
          console.log(`Category "${categoryName}" not found.`);
          const cats = await scraper.getCategories();
          console.log(`Available categories: ${cats.join(', ')}`);
        } else {
          console.log(`\nChannels for "${categoryName}":`);
          await showChannels(catChannels);
        }
        break;

      case command === 'categories':
        const categories = await scraper.getCategories();
        console.log('\nAvailable Categories:\n');
        categories.forEach((cat, i) => console.log(`  ${i + 1}. ${cat}`));
        console.log(`\nTotal: ${categories.length}`);
        break;

      case command === 'events':
        const allEvents = await scraper.getAllEvents();
        await showEvents(allEvents);
        break;

      case command === 'events:today':
        const todayEvents = await scraper.getTodaysEvents();
        console.log(`\nToday's Events:`);
        await showEvents(todayEvents);
        break;

      case command.startsWith('events:'):
        const countryQuery = command.split(':')[1];
        const countryEvents = await scraper.getEventsByCountry(countryQuery);
        if (countryEvents.length === 0) {
          console.log(`No events found for "${countryQuery}".`);
        } else {
          console.log(`\nEvents for "${countryQuery}":`);
          await showEvents(countryEvents);
        }
        break;

      case command.startsWith('search:'):
        const query = command.split(':')[1];
        const results = await scraper.searchChannels(query);
        console.log(`\nSearch results for "${query}":`);
        await showChannels(results);
        break;

      case command === 'stats':
        await showStats();
        break;

      case command === 'all':
        const data = await scraper.getAllData();
        console.log(`\nComplete data dump:`);
        console.log(JSON.stringify(data, null, 2));
        break;

      case command.startsWith('stream:'):
        const streamUrl = command.split(':')[1];
        if (!streamUrl || streamUrl === 'stream') {
          console.log('Usage: node cli.js stream:<full-stream-url>');
          break;
        }
        const streamInfo = await scraper.getStreamInfo(streamUrl);
        console.log(`\nStream Info for: ${streamUrl}`);
        console.log(JSON.stringify(streamInfo, null, 2));
        break;

      case command === 'raw:status':
        const rawStatus = await scraper.getRawStatusJSON();
        console.log(JSON.stringify(rawStatus, null, 2));
        break;

      case command === 'raw:diaries':
        const rawDiaries = await scraper.getRawDiariesJSON();
        console.log(JSON.stringify(rawDiaries, null, 2));
        break;

      default:
        console.log(`Unknown command: ${command}`);
        console.log('Run "node cli.js help" for usage information.');
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.status) {
      console.error(`   Status: ${error.status}`);
      console.error(`   URL: ${error.url}`);
    }
    process.exit(1);
  }
}

main();
