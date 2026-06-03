#!/usr/bin/env node

/**
 * Comprehensive API Test Suite for tvtvhd.com Scraper
 * Tests every endpoint, validates data completeness, and reports results
 */

import { TVTVHDScraper } from './src/index.js';
import { BASE_DOMAIN } from './src/client.js';

const scraper = new TVTVHDScraper();

let passed = 0;
let failed = 0;
let warnings = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    return true;
  } else {
    failed++;
    console.error(`  ❌ FAIL: ${message}`);
    return false;
  }
}

function warn(message) {
  warnings++;
  console.warn(`  ⚠️  WARN: ${message}`);
}

function section(title) {
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`  ${title}`);
  console.log(`${'═'.repeat(60)}`);
}

function subsection(title) {
  console.log(`\n  ── ${title} ──`);
}

async function testChannels() {
  section('📺 CHANNELS API TESTS');

  // 1. Get all categories
  subsection('getCategories()');
  try {
    const categories = await scraper.getCategories();
    console.log(`  Categories found: ${categories.length}`);
    assert(categories.length === 11, `Expected 11 categories, got ${categories.length}`);
    assert(categories.includes('ARGENTINA'), 'Should include ARGENTINA');
    assert(categories.includes('MÉXICO'), 'Should include MÉXICO');
    assert(categories.includes('ESPAÑA'), 'Should include ESPAÑA');
    assert(categories.includes('USA'), 'Should include USA');
    assert(categories.includes('BRASIL'), 'Should include BRASIL');
    assert(categories.includes('MUNDO'), 'Should include MUNDO');
    assert(categories.includes('LATINOAMERICA'), 'Should include LATINOAMERICA');
    assert(categories.includes('PORTUGAL'), 'Should include PORTUGAL');
    assert(categories.includes('CHILE'), 'Should include CHILE');
    assert(categories.includes('COLOMBIA'), 'Should include COLOMBIA');
    assert(categories.includes('PERÚ'), 'Should include PERÚ');
  } catch (e) {
    failed++;
    console.error(`  ❌ Error in getCategories(): ${e.message}`);
  }

  // 2. Get all channels (flat)
  subsection('getAllChannels()');
  try {
    const allChannels = await scraper.getAllChannels();
    console.log(`  Total channels: ${allChannels.length}`);
    assert(allChannels.length === 108, `Expected 108 total channels, got ${allChannels.length}`);
    
    // Verify structure
    const sample = allChannels[0];
    assert(typeof sample.name === 'string' && sample.name.length > 0, 'Channel should have a name');
    assert(typeof sample.category === 'string' && sample.category.length > 0, 'Channel should have a category');
    assert(typeof sample.streamUrl === 'string', 'Channel should have a streamUrl');
    assert(typeof sample.isActive === 'boolean', 'Channel should have isActive boolean');
    assert(typeof sample.status === 'string', 'Channel should have a status string');
    
    // Verify stream URL pattern
    const streamUrls = allChannels.map(c => c.streamUrl);
    const validStreamPattern = streamUrls.every(url => 
      url && (url.startsWith('https://tvtvhd.com/vivo/') || url.startsWith('http'))
    );
    assert(validStreamPattern, 'All channels should have valid stream URLs');
    
    // Log stream URL pattern for verification
    console.log(`  Stream URL pattern: ${sample.streamUrl}`);
    
    // Count by category
    const catCounts = {};
    for (const ch of allChannels) {
      catCounts[ch.category] = (catCounts[ch.category] || 0) + 1;
    }
    console.log('  Channels by category:');
    for (const [cat, count] of Object.entries(catCounts)) {
      console.log(`    ${cat}: ${count}`);
    }
  } catch (e) {
    failed++;
    console.error(`  ❌ Error in getAllChannels(): ${e.message}`);
  }

  // 3. Get active channels
  subsection('getActiveChannels()');
  try {
    const active = await scraper.getActiveChannels();
    console.log(`  Active channels: ${active.length}`);
    assert(active.length > 0, 'Should have at least some active channels');
    assert(active.every(c => c.isActive === true), 'All returned channels should be active');
    assert(active.length < 108, 'Active channels should be less than total');
    console.log(`  Active stream URLs: ${active.length}`);
  } catch (e) {
    failed++;
    console.error(`  ❌ Error in getActiveChannels(): ${e.message}`);
  }

  // 4. Get channels by category name
  subsection('getChannelsByCategoryName()');
  try {
    // Test with valid categories
    const argentina = await scraper.getChannelsByCategoryName('ARGENTINA');
    assert(argentina !== null, 'ARGENTINA category should exist');
    assert(argentina.length === 9, `Expected 9 ARGENTINA channels, got ${argentina.length}`);
    console.log(`  ARGENTINA: ${argentina.length} channels`);
    
    const mexico = await scraper.getChannelsByCategoryName('mexico');
    assert(mexico !== null, 'mexico (lowercase) should match');
    assert(mexico.length === 17, `Expected 17 MÉXICO channels, got ${mexico.length}`);
    console.log(`  MÉXICO: ${mexico.length} channels`);
    
    // Test case-insensitive
    const usa = await scraper.getChannelsByCategoryName('usa');
    assert(usa !== null, 'USA should exist');
    assert(usa.length === 16, `Expected 16 USA channels, got ${usa.length}`);
    console.log(`  USA: ${usa.length} channels`);
    
    // Test invalid category
    const invalid = await scraper.getChannelsByCategoryName('NONEXISTENT');
    assert(invalid === null, 'NONEXISTENT category should return null');
    console.log('  Invalid category correctly returns null');
    
    // Verify stream URLs within a category
    if (argentina) {
      for (const ch of argentina) {
        assert(ch.streamUrl && ch.streamUrl.startsWith('http'), 
          `Channel ${ch.name} should have valid stream URL: ${ch.streamUrl}`);
      }
      console.log('  All ARGENTINA channels have valid stream URLs');
      argentina.forEach(ch => console.log(`    ${ch.name}: ${ch.streamUrl}`));
    }
  } catch (e) {
    failed++;
    console.error(`  ❌ Error in getChannelsByCategoryName(): ${e.message}`);
  }

  // 5. Get channel statistics
  subsection('getChannelStats()');
  try {
    const stats = await scraper.getChannelStats();
    assert(stats.totalCategories === 11, `Expected 11 categories`);
    assert(stats.totalChannels === 108, `Expected 108 total channels`);
    assert(stats.totalActive > 0, 'Should have active channels');
    assert(typeof stats.totalInactive === 'number', 'Should have inactive count');
    assert(Array.isArray(stats.categories), 'Categories should be an array');
    assert(stats.categories.length === 11, 'Should have 11 category stats');
    console.log(`  Stats: ${stats.totalChannels} total, ${stats.totalActive} active, ${stats.totalInactive} inactive, ${stats.totalCategories} categories`);
    
    // Verify category totals sum correctly
    const catTotalSum = stats.categories.reduce((sum, c) => sum + c.total, 0);
    assert(catTotalSum === stats.totalChannels, `Category totals (${catTotalSum}) should sum to total channels (${stats.totalChannels})`);
    
    const catActiveSum = stats.categories.reduce((sum, c) => sum + c.active, 0);
    assert(catActiveSum === stats.totalActive, `Category active sum (${catActiveSum}) should match total active (${stats.totalActive})`);
  } catch (e) {
    failed++;
    console.error(`  ❌ Error in getChannelStats(): ${e.message}`);
  }

  // 6. Search channels
  subsection('searchChannels()');
  try {
    const espnResults = await scraper.searchChannels('ESPN');
    console.log(`  Search "ESPN": ${espnResults.length} results`);
    assert(espnResults.length >= 10, `Should find at least 10 ESPN channels, found ${espnResults.length}`);
    assert(espnResults.every(c => c.name.toUpperCase().includes('ESPN')), 'All results should contain ESPN');
    
    const foxResults = await scraper.searchChannels('fox');
    console.log(`  Search "fox": ${foxResults.length} results`);
    assert(foxResults.length >= 5, `Should find at least 5 Fox channels, found ${foxResults.length}`);
    
    // Search non-existent
    const noResults = await scraper.searchChannels('XYZZZZ_NONEXISTENT');
    assert(noResults.length === 0, 'Non-existent search should return empty array');
    console.log('  Non-existent search correctly returns empty array');
  } catch (e) {
    failed++;
    console.error(`  ❌ Error in searchChannels(): ${e.message}`);
  }

  // 7. Channels by category (grouped)
  subsection('getChannelsByCategory()');
  try {
    const grouped = await scraper.getChannelsByCategory();
    assert(Array.isArray(grouped), 'Should return an array');
    assert(grouped.length === 11, 'Should have 11 category groups');
    
    for (const group of grouped) {
      assert(typeof group.category === 'string', 'Group should have category name');
      assert(Array.isArray(group.channels), 'Group should have channels array');
      assert(typeof group.totalChannels === 'number', 'Group should have totalChannels');
      assert(typeof group.activeChannels === 'number', 'Group should have activeChannels');
      
      for (const ch of group.channels) {
        assert(ch.name, 'Channel should have name');
        assert(ch.streamUrl, 'Channel should have streamUrl');
      }
    }
    console.log('  Grouped channels structure is valid');
  } catch (e) {
    failed++;
    console.error(`  ❌ Error in getChannelsByCategory(): ${e.message}`);
  }
}

async function testEvents() {
  section('📅 EVENTS API TESTS');

  // 1. Get all events
  subsection('getAllEvents()');
  try {
    const events = await scraper.getAllEvents();
    console.log(`  Total events found: ${events.length}`);
    assert(events.length > 0, 'Should have at least some events');
    
    // Verify event structure
    const sample = events[0];
    assert(typeof sample.id === 'number', 'Event should have numeric id');
    assert(typeof sample.description === 'string', 'Event should have description');
    assert(typeof sample.hour === 'string', 'Event should have hour string');
    assert(typeof sample.date === 'string', 'Event should have date string');
    assert(sample.country === null || typeof sample.country.name === 'string', 'Event should have country');
    assert(Array.isArray(sample.embeds), 'Event should have embeds array');
    
    console.log(`  Sample event: ${sample.date} ${sample.hour} - ${sample.description} [${sample.country?.name}]`);
    if (sample.embeds.length > 0) {
      console.log(`  First embed: ${sample.embeds[0].name} -> ${sample.embeds[0].iframe?.url}`);
    }
    
    // Log all events
    console.log('\n  All events:');
    for (const ev of events) {
      const embedNames = ev.embeds.map(e => e.name).join(', ') || 'none';
      console.log(`    ${ev.date} ${ev.hour} | ${ev.country?.name?.padEnd(14)} | ${(ev.description || '').substring(0, 50).padEnd(52)} | ${embedNames}`);
    }
    
    // Check for embed iframe URLs
    const eventsWithEmbeds = events.filter(e => e.embeds.length > 0);
    console.log(`\n  Events with embed links: ${eventsWithEmbeds.length}/${events.length}`);
    
    if (eventsWithEmbeds.length > 0) {
      const eventWithIframe = eventsWithEmbeds.find(e => e.embeds.some(emb => emb.iframe?.url));
      if (eventWithIframe) {
        const embed = eventWithIframe.embeds.find(e => e.iframe?.url);
        console.log(`  Sample iframe URL: ${embed.iframe.url}`);
        if (embed.iframe.decodedParams) {
          console.log(`  Decoded params: ${JSON.stringify(embed.iframe.decodedParams)}`);
        }
      }
    }
  } catch (e) {
    failed++;
    console.error(`  ❌ Error in getAllEvents(): ${e.message}`);
  }

  // 2. Get today's events
  subsection('getTodaysEvents()');
  try {
    const todayEvents = await scraper.getTodaysEvents();
    console.log(`  Today's events: ${todayEvents.length}`);
    assert(todayEvents.length > 0, 'Should have today events');
    
    for (const ev of todayEvents) {
      assert(ev.date === new Date().toISOString().split('T')[0], 'Event date should be today');
    }
    console.log('  All events correctly filtered to today');
  } catch (e) {
    failed++;
    console.error(`  ❌ Error in getTodaysEvents(): ${e.message}`);
  }

  // 3. Get events by date
  subsection('getEventsByDate()');
  try {
    const today = new Date().toISOString().split('T')[0];
    const byDate = await scraper.getEventsByDate(today);
    assert(byDate.length > 0, `Should have events for ${today}`);
    assert(byDate.every(e => e.date === today), 'All events should match the date');
    console.log(`  Events for ${today}: ${byDate.length}`);
    
    // Non-existent date
    const noDate = await scraper.getEventsByDate('2099-01-01');
    assert(noDate.length === 0, 'Future date should return empty array');
    console.log('  Non-existent date correctly returns empty');
  } catch (e) {
    failed++;
    console.error(`  ❌ Error in getEventsByDate(): ${e.message}`);
  }

  // 4. Get events by country
  subsection('getEventsByCountry()');
  try {
    const argentinaEvents = await scraper.getEventsByCountry('Argentina');
    console.log(`  Argentina events: ${argentinaEvents.length}`);
    assert(argentinaEvents.length > 0, 'Should have Argentina events');
    assert(argentinaEvents.every(e => e.country?.name === 'Argentina'), 'All should be Argentina');
    
    // Non-existent country
    const noCountry = await scraper.getEventsByCountry('Atlantis');
    assert(noCountry.length === 0, 'Non-existent country should return empty');
    console.log('  Non-existent country correctly returns empty');
  } catch (e) {
    failed++;
    console.error(`  ❌ Error in getEventsByCountry(): ${e.message}`);
  }

  // 5. Search events
  subsection('searchEvents()');
  try {
    const futbolResults = await scraper.searchEvents('fútbol');
    console.log(`  Search "fútbol": ${futbolResults.length} results`);
    
    const tennisResults = await scraper.searchEvents('tennis');
    console.log(`  Search "tennis": ${tennisResults.length} results`);
    
    // Non-existent search
    const noSearch = await scraper.searchEvents('XYZZZ_NONEXISTENT');
    assert(noSearch.length === 0, 'Non-existent search should return empty');
    console.log('  Non-existent event search correctly returns empty');
  } catch (e) {
    failed++;
    console.error(`  ❌ Error in searchEvents(): ${e.message}`);
  }

  // 6. Event stats
  subsection('getEventStats()');
  try {
    const stats = await scraper.getEventStats();
    assert(stats.totalEvents > 0, 'Should have events');
    assert(stats.uniqueDates.length > 0, 'Should have unique dates');
    assert(stats.uniqueCountries.length > 0, 'Should have unique countries');
    assert(Array.isArray(stats.eventsByDate), 'Should have eventsByDate');
    assert(Array.isArray(stats.eventsByCountry), 'Should have eventsByCountry');
    console.log(`  Event stats: ${stats.totalEvents} events, ${stats.uniqueDates.length} dates, ${stats.uniqueCountries.length} countries`);
    console.log(`  Dates: ${stats.uniqueDates.join(', ')}`);
    console.log(`  Countries: ${stats.uniqueCountries.join(', ')}`);
  } catch (e) {
    failed++;
    console.error(`  ❌ Error in getEventStats(): ${e.message}`);
  }
}

async function testStreams() {
  section('🌊 STREAMS API TESTS');

  subsection('getStreamInfo() - Fox Sports Argentina');
  try {
    const streamUrl = 'https://tvtvhd.com/vivo/canales.php?stream=foxsports';
    console.log(`  Fetching: ${streamUrl}`);
    
    const info = await scraper.getStreamInfo(streamUrl);
    
    assert(info.streamUrl === streamUrl, 'Stream URL should match');
    assert(info.streamId === 'foxsports', `Stream ID should be 'foxsports', got '${info.streamId}'`);
    assert(typeof info.title === 'string' || info.title === null, 'Should have title or null');
    assert(Array.isArray(info.iframes), 'Should have iframes array');
    assert(Array.isArray(info.scripts), 'Should have scripts array');
    assert(Array.isArray(info.links), 'Should have links array');
    assert(Array.isArray(info.hlsStreams), 'Should have hlsStreams array');
    assert(typeof info.rawHtmlSize === 'number', 'Should have rawHtmlSize');
    
    console.log(`  Title: ${info.title}`);
    console.log(`  HTML size: ${info.rawHtmlSize} bytes`);
    console.log(`  Iframes found: ${info.iframes.length}`);
    console.log(`  Scripts found: ${info.scripts.length}`);
    console.log(`  Links found: ${info.links.length}`);
    console.log(`  HLS/m3u8 streams: ${info.hlsStreams.length}`);
    
    if (info.iframes.length > 0) {
      console.log('\n  Iframes:');
      for (const iframe of info.iframes) {
        console.log(`    src: ${iframe.src}`);
        console.log(`    fullUrl: ${iframe.fullUrl}`);
      }
    }
    
    if (info.hlsStreams.length > 0) {
      console.log('\n  HLS Streams:');
      for (const hls of info.hlsStreams) {
        console.log(`    ${hls}`);
      }
    }

    if (info.links.length > 0) {
      console.log(`\n  Links (first 10):`);
      for (const link of info.links.slice(0, 10)) {
        console.log(`    ${link.url}`);
      }
    }
  } catch (e) {
    failed++;
    console.error(`  ❌ Error in getStreamInfo() foxsports: ${e.message}`);
  }

  subsection('getStreamInfo() - TyC Sports Argentina');
  try {
    const streamUrl = 'https://tvtvhd.com/vivo/canales.php?stream=tycsports';
    console.log(`  Fetching: ${streamUrl}`);
    
    const info = await scraper.getStreamInfo(streamUrl);
    
    assert(info.streamId === 'tycsports', `Stream ID should be 'tycsports'`);
    assert(Array.isArray(info.iframes), 'Should have iframes');
    assert(Array.isArray(info.hlsStreams), 'Should have hlsStreams');
    
    console.log(`  Title: ${info.title}`);
    console.log(`  HTML size: ${info.rawHtmlSize} bytes`);
    console.log(`  Iframes: ${info.iframes.length}`);
    console.log(`  HLS streams: ${info.hlsStreams.length}`);
    
    if (info.iframes.length > 0) {
      console.log('\n  Iframes:');
      for (const iframe of info.iframes) {
        console.log(`    ${iframe.src}`);
      }
    }
  } catch (e) {
    failed++;
    console.error(`  ❌ Error in getStreamInfo() tycsports: ${e.message}`);
  }

  subsection('getStreamInfo() - ESPN');
  try {
    const streamUrl = 'https://tvtvhd.com/vivo/canales.php?stream=espn';
    console.log(`  Fetching: ${streamUrl}`);
    
    const info = await scraper.getStreamInfo(streamUrl);
    
    assert(info.streamId === 'espn', `Stream ID should be 'espn'`);
    console.log(`  Title: ${info.title}`);
    console.log(`  HTML size: ${info.rawHtmlSize} bytes`);
    console.log(`  Iframes: ${info.iframes.length}`);
    console.log(`  HLS streams: ${info.hlsStreams.length}`);
    console.log(`  Scripts: ${info.scripts.length}`);
    
    if (info.iframes.length > 0) {
      for (const iframe of info.iframes) {
        console.log(`  iframe: ${iframe.src}`);
      }
    }
  } catch (e) {
    failed++;
    console.error(`  ❌ Error in getStreamInfo() espn: ${e.message}`);
  }

  subsection('extractStreamId()');
  try {
    const { extractStreamId } = await import('./src/streams.js');
    
    assert(extractStreamId('https://tvtvhd.com/vivo/canales.php?stream=foxsports') === 'foxsports', 'Should extract foxsports');
    assert(extractStreamId('https://tvtvhd.com/vivo/canales.php?stream=tycsports') === 'tycsports', 'Should extract tycsports');
    assert(extractStreamId('https://tvtvhd.com/vivo/canales.php?stream=espnpremium') === 'espnpremium', 'Should extract espnpremium');
    assert(extractStreamId('invalid-url') === null, 'Invalid URL should return null');
    assert(extractStreamId('https://example.com') === null, 'URL without stream param should return null');
    
    console.log('  Stream ID extraction works correctly');
  } catch (e) {
    failed++;
    console.error(`  ❌ Error in extractStreamId(): ${e.message}`);
  }
}

async function testRawData() {
  section('📄 RAW DATA TESTS');

  subsection('getRawStatusJSON()');
  try {
    const rawStatus = await scraper.getRawStatusJSON();
    assert(typeof rawStatus === 'object' && !Array.isArray(rawStatus), 'Should be an object');
    const keys = Object.keys(rawStatus);
    assert(keys.length === 11, `Should have 11 category keys, got ${keys.length}`);
    
    // Verify raw structure
    const sampleCategory = keys[0];
    const sampleChannels = rawStatus[sampleCategory];
    assert(Array.isArray(sampleChannels), 'Category should contain array');
    assert(sampleChannels.length > 0, 'Category should have channels');
    
    const sampleChannel = sampleChannels[0];
    assert('Canal' in sampleChannel, 'Should have Canal field');
    assert('Estado' in sampleChannel, 'Should have Estado field');
    assert('Link' in sampleChannel, 'Should have Link field');
    
    console.log(`  Raw categories: ${keys.join(', ')}`);
    console.log(`  Sample channel from ${sampleCategory}: ${sampleChannel.Canal} (${sampleChannel.Estado}) -> ${sampleChannel.Link}`);
    
    // Count total raw channels
    let totalRawChannels = 0;
    for (const cat of keys) {
      totalRawChannels += rawStatus[cat].length;
    }
    assert(totalRawChannels === 108, `Should have 108 total raw channels, got ${totalRawChannels}`);
    console.log(`  Total raw channels: ${totalRawChannels}`);
  } catch (e) {
    failed++;
    console.error(`  ❌ Error in getRawStatusJSON(): ${e.message}`);
  }

  subsection('getRawDiariesJSON()');
  try {
    const rawDiaries = await scraper.getRawDiariesJSON();
    assert(typeof rawDiaries === 'object', 'Should return an object');
    assert('data' in rawDiaries, 'Should have data key (Strapi CMS format)');
    assert(Array.isArray(rawDiaries.data), 'data should be an array');
    assert(rawDiaries.data.length > 0, 'Should have diary entries');
    
    const sampleDiary = rawDiaries.data[0];
    assert('id' in sampleDiary, 'Entry should have id');
    assert('attributes' in sampleDiary, 'Entry should have attributes');
    assert('diary_description' in sampleDiary.attributes, 'Should have description');
    assert('diary_hour' in sampleDiary.attributes, 'Should have hour');
    assert('date_diary' in sampleDiary.attributes, 'Should have date');
    assert('embeds' in sampleDiary.attributes, 'Should have embeds');
    
    console.log(`  Total raw diary entries: ${rawDiaries.data.length}`);
    console.log(`  Sample entry: ${sampleDiary.attributes.date_diary} ${sampleDiary.attributes.diary_hour} - ${sampleDiary.attributes.diary_description}`);
    
    // Count total embeds
    let totalEmbeds = 0;
    for (const entry of rawDiaries.data) {
      totalEmbeds += entry.attributes?.embeds?.data?.length || 0;
    }
    console.log(`  Total embed sources: ${totalEmbeds}`);
  } catch (e) {
    failed++;
    console.error(`  ❌ Error in getRawDiariesJSON(): ${e.message}`);
  }
}

async function testEdgeCases() {
  section('⚡ EDGE CASE TESTS');

  subsection('Invalid category name');
  try {
    const result = await scraper.getChannelsByCategoryName('');
    assert(result === null, 'Empty string should return null');
    
    const result2 = await scraper.getChannelsByCategoryName('  ');
    assert(result2 === null, 'Whitespace should return null');
    
    console.log('  Invalid categories correctly handled');
  } catch (e) {
    failed++;
    console.error(`  ❌ Error: ${e.message}`);
  }

  subsection('Empty search queries');
  try {
    const emptySearch = await scraper.searchChannels('');
    // Empty search should return all channels or empty
    console.log(`  Empty search returns ${emptySearch.length} results`);
    
    const allChannels = await scraper.getAllChannels();
    // Should match all channels since empty string is in everything
    assert(emptySearch.length === allChannels.length, 'Empty search should match all channels');
    console.log('  Empty search correctly matches all');
  } catch (e) {
    failed++;
    console.error(`  ❌ Error: ${e.message}`);
  }

  subsection('Event edge cases');
  try {
    // Events on non-existent date
    const futureEvents = await scraper.getEventsByDate('2050-01-01');
    assert(futureEvents.length === 0, 'Future date should have no events');
    console.log('  Future date correctly returns empty');
    
    // Non-existent country
    const noCountryEvents = await scraper.getEventsByCountry('');
    assert(noCountryEvents.length === 0, 'Empty country should return empty');
    console.log('  Empty country correctly returns empty');
  } catch (e) {
    failed++;
    console.error(`  ❌ Error in event edge cases: ${e.message}`);
  }

  subsection('Stream edge cases');
  try {
    const { extractStreamId } = await import('./src/streams.js');
    
    // URL with multiple params
    assert(extractStreamId('https://tvtvhd.com/vivo/canales.php?stream=test&extra=foo') === 'test', 'Should handle extra params');
    
    // No protocol
    assert(extractStreamId('/vivo/canales.php?stream=abc123') === 'abc123', 'Should handle relative URLs');
    
    // Empty param
    assert(extractStreamId('https://tvtvhd.com/vivo/canales.php?stream=') === '', 'Empty stream param returns empty string');
    
    console.log('  Stream edge cases handled correctly');
  } catch (e) {
    failed++;
    console.error(`  ❌ Error: ${e.message}`);
  }
}

async function testGetAllData() {
  section('📦 COMPREHENSIVE DATA DUMP');
  
  try {
    const allData = await scraper.getAllData();
    
    assert(typeof allData.scrapedAt === 'string', 'Should have scrapedAt timestamp');
    assert(allData.channels.total === 108, `Expected 108 channels, got ${allData.channels.total}`);
    assert(allData.channels.total > 0, 'Should have channels');
    assert(allData.channels.items.length === 108, 'Channel items should match total');
    assert(allData.events.total > 0, 'Should have events');
    assert(allData.events.items.length === allData.events.total, 'Event items should match total');
    
    console.log(`  Scraped at: ${allData.scrapedAt}`);
    console.log(`  Channels: ${allData.channels.total} (${allData.channels.active} active)`);
    console.log(`  Events: ${allData.events.total}`);
    
    // Quick verification of random channel data
    const sampleChannel = allData.channels.items[0];
    assert(sampleChannel.streamUrl && sampleChannel.streamUrl.includes('tvtvhd.com'), 
      'Channel stream URLs should point to tvtvhd.com');
    
    console.log(`  Sample channel: ${sampleChannel.name} -> ${sampleChannel.streamUrl}`);
    
  } catch (e) {
    failed++;
    console.error(`  ❌ Error in getAllData(): ${e.message}`);
  }
}

// ─── Main Runner ──────────────────────────────────────

async function main() {
  console.log('╔═══════════════════════════════════════════════════╗');
  console.log('║     TVTVHD SCRAPER - COMPREHENSIVE API TEST      ║');
  console.log('╚═══════════════════════════════════════════════════╝');
  console.log(`  Started: ${new Date().toISOString()}`);
  console.log(`  Node: ${process.version}`);
  console.log(`  Platform: ${process.platform}`);

  const startTime = Date.now();

  await testChannels();
  await testEvents();
  await testStreams();
  await testRawData();
  await testEdgeCases();
  await testGetAllData();

  const duration = Date.now() - startTime;
  
  console.log(`\n${'═'.repeat(60)}`);
  console.log('  RESULTS SUMMARY');
  console.log(`${'═'.repeat(60)}`);
  console.log(`  ✅ Passed: ${passed}`);
  console.log(`  ❌ Failed: ${failed}`);
  console.log(`  ⚠️  Warnings: ${warnings}`);
  console.log(`  ⏱  Duration: ${(duration / 1000).toFixed(1)}s`);
  
  if (failed === 0) {
    console.log(`\n  🎉 All tests passed!`);
  } else {
    console.log(`\n  ❌ ${failed} test(s) failed.`);
  }
  
  process.exit(failed > 0 ? 1 : 0);
}

main();
