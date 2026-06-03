const site = {"name":"Fútbol Libre TV","tagline":"Live channels & matches","hd":"HD streaming"};
const nav = {"home":"Home","channels":"Channels","events":"Events","watch":"Watch","close":"Close"};
const hero = {"badge":"{count} live channels","titleLine1":"Live football,","titleLine2":"wherever you are.","subtitle":"Access live sports channels and follow the match schedule from the world's most important leagues and tournaments, all in one place.","exploreCta":"Explore Channels","scheduleCta":"View Schedule"};
const stats = {"totalChannels":"Total Channels","liveChannels":"Live Channels","categories":"Categories","eventsToday":"Events Today"};
const categories = {"label":"Categories","title":"Explore by region.","subtitle":"{count} regions with live sports channels.","active":"{active}/{total} active"};
const featured = {"label":"Live Now","title":"Featured channels.","viewAll":"View all","empty":"No channels available at the moment.","viewAllChannels":"View all channels","mobileCta":"View all channels"};
const schedule = {"label":"Sports Schedule","title":"Today's matches.","subtitle":"{count} scheduled event{s}","viewFull":"View full schedule","viewToday":"View all {count} event{s} today","empty":"No events scheduled for today."};
const cta = {"title":"All football in one place.","subtitle":"{channels} channels from {categories} regions. Live streams of the most important leagues and tournaments.","startWatching":"Start Watching","viewSchedule":"View Schedule"};
const events = {"pageTitle":"Sports Schedule — Matches & Events — {site}","pageDesc":"Browse the complete schedule of sports matches and events. Filter by date and country to find the streams you're looking for.","headerLabel":"Sports Schedule","headerTitle":"Events & matches.","headerSubtitle":"{events} events across {dates} date{s}, {countries} countr{plural}.","total":"Total","dates":"Dates","countries":"Countries","eventCount":"{count} event{s}","emptyTitle":"No events available","emptySubtitle":"No scheduled events found. Try again later.","unknownDate":"Unknown date","unnamedEvent":"Unnamed event"};
const modal = {"loading":"Loading...","fullscreen":"Fullscreen","close":"Close","selectStream":"Select a stream to play","loadingStream":"Loading stream...","noStream":"No stream available for this channel.","streamUnavailable":"Stream unavailable","errorLoading":"Error loading stream","errorTitle":"Error","retry":"Retry","live":"Live","notSupported":"This browser does not support HLS playback."};
const notFound = {"pageTitle":"Page not found — 404 — {site}","pageDesc":"The page you are looking for does not exist.","title":"Page not found.","subtitle":"The page you are looking for doesn't exist or has been moved. Check the URL or go back home to find what you need.","goHome":"Go Home","browseChannels":"Browse Channels"};
const channel = {"pageTitleLive":"{name} — Live — {site}","pageTitleNotFound":"Channel not found — {site}","pageDesc":"Watch {name} live. Stream from {category} in HD quality.","pageDescNotFound":"The requested channel is not available.","breadcrumbChannels":"Channels","live":"Live","inactive":"Inactive","playingDirectly":"Stream playing directly","livePlayback":"Live playback","techInfo":"Stream technical info","hlsStreams":"HLS Streams","embeds":"Embeds","info":"Info","channelLabel":"Channel","region":"Region","status":"Status","quality":"Quality","protocol":"Protocol","playback":"Playback","direct":"Direct","notFound":"Channel not found","notFoundSubtitle":"The channel you're looking for is not available or doesn't exist.","browseChannels":"Browse Channels"};
const channelsPage = {"pageTitle":"Live Channels — {site}","pageDesc":"Explore all live sports channels available. Filter by region, search for your favorite channel, and enjoy HD streams.","label":"Channels","searchPlaceholder":"Search channels...","all":"All","live":"Live","count":"{count} channel{s}","foundResults":"{count} channel{s} found for \"{query}\"","notFoundTitle":"No channels found for \"{query}\"","notFoundTitleCategory":"No channels in this category","notFoundSubtitle":"Try a different search term or browse all categories.","viewAll":"View all channels"};
const footer = {"navigation":"Navigation","home":"Home","channels":"Channels","events":"Events","channelsSection":"Channels","argentina":"Argentina","mexico":"Mexico","spain":"Spain","usa":"USA","regions":"Regions","latinAmerica":"Latin America","brazil":"Brazil","portugal":"Portugal","world":"World","info":"Info","brand":"Fútbol Libre TV","tagline":"Live channels & matches","hd":"HD streaming","copyright":"© {year} Fútbol Libre TV. All rights reserved.","version":"v1.0.0"};
const player = {"live":"Live","errorLoading":"Error loading stream","retry":"Retry","unavailable":"Stream unavailable","unavailableSubtitle":"No video source available for this channel.","notSupported":"This browser does not support HLS playback."};
const channelCard = {"live":"Live","inactive":"Inactive","streamingLive":"Streaming live","noStream":"No stream","watchStream":"Watch stream"};
const search = {"placeholder":"Search channels..."};
const en = {
  site,
  nav,
  hero,
  stats,
  categories,
  featured,
  schedule,
  cta,
  events,
  modal,
  notFound,
  channel,
  channelsPage,
  footer,
  player,
  channelCard,
  search,
};

export { categories, channel, channelCard, channelsPage, cta, en as default, events, featured, footer, hero, modal, nav, notFound, player, schedule, search, site, stats };
