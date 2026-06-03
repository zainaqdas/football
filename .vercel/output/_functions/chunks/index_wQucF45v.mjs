import { c as createComponent } from './astro-component_DJn0TBVV.mjs';
import 'piccolore';
import { m as maybeRenderHead, h as addAttribute, k as renderTemplate, o as renderComponent } from './entrypoint_Bi04DfOe.mjs';
import { $ as $$Layout } from './Layout_BxoymiiG.mjs';
import 'clsx';
import { $ as $$ChannelCard } from './ChannelCard_jD4it1uo.mjs';
import { $ as $$EventCard } from './EventCard_CPhUjD9c.mjs';
import { T as TVTVHDScraper } from './index_-JAiwH9B.mjs';

const $$StatsCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$StatsCard;
  const { label, value, change, icon, class: className = "" } = Astro2.props;
  const iconPaths = {
    channels: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
    active: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    events: "M8 2v4M16 2v4M3 10h18M21 14a7 7 0 01-14 0",
    categories: "M4 6h16M4 10h16M4 14h16M4 18h16"
  };
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(`bg-canvas rounded-lg card-hairline p-5 transition-all duration-300 hover:shadow-elevated ${className}`, "class")}> <div class="flex items-center gap-3"> ${icon && renderTemplate`<div class="shrink-0 w-10 h-10 rounded-lg bg-canvas-soft-2 flex items-center justify-center"> <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-body"> <path${addAttribute(iconPaths[icon] || iconPaths.channels, "d")}></path> </svg> </div>`} <div class="flex-1 min-w-0"> <p class="text-sm text-mute font-medium">${label}</p> <p class="text-2xl font-semibold text-ink mt-0.5 tracking-tight">${value}</p> </div> ${change && renderTemplate`<span class="shrink-0 text-xs font-mono text-success bg-link-bg-soft px-2 py-0.5 rounded-full"> ${change} </span>`} </div> </div>`;
}, "/home/dgfrii1800/football/src/components/StatsCard.astro", void 0);

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const scraper = new TVTVHDScraper();
  let channelStats, categories, allChannels, todayEvents, eventStats;
  try {
    [channelStats, categories, allChannels, todayEvents, eventStats] = await Promise.all([
      scraper.getChannelStats(),
      scraper.getCategories(),
      scraper.getAllChannels(),
      scraper.getTodaysEvents(),
      scraper.getEventStats()
    ]);
  } catch (e) {
    channelStats = { totalChannels: 0, totalActive: 0, totalInactive: 0, totalCategories: 0, categories: [] };
    categories = [];
    allChannels = [];
    todayEvents = [];
    eventStats = { totalEvents: 0, uniqueCountries: [] };
  }
  const featuredChannels = allChannels.filter((c) => c.isActive).slice(0, 8);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Fútbol Libre TV — Live Channels & Football Matches Online", "description": "Access live sports channels and follow the match schedule from the world's most important leagues and tournaments, all in one place." }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<section class="relative overflow-hidden bg-canvas"> <div class="mesh-gradient absolute inset-0 opacity-60"></div> <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40"> <div class="max-w-3xl mx-auto text-center"> <!-- Badge --> <div class="inline-flex items-center gap-2 px-4 py-1.5 bg-canvas/80 backdrop-blur-sm border border-hairline rounded-full text-xs font-mono text-body mb-8 animate-fade-in"> <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> ${channelStats.totalActive} live channels
</div> <h1 class="text-4xl sm:text-5xl lg:text-6xl font-semibold text-ink leading-[1.05] tracking-[-2.4px] sm:tracking-[-3px] animate-fade-in" style="animation-delay: 100ms">
Live football,<br> <span class="bg-gradient-to-r from-grad-dev-start via-grad-prev-end to-grad-ship-start bg-clip-text text-transparent">wherever you are.</span> </h1> <p class="mt-6 text-lg sm:text-xl text-body leading-relaxed max-w-xl mx-auto animate-fade-in" style="animation-delay: 200ms">
Access live sports channels and follow the match schedule from the world's most important leagues and tournaments, all in one place.
</p> <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style="animation-delay: 300ms"> <a href="/channels" class="inline-flex items-center h-12 px-8 bg-ink text-white text-base font-medium rounded-pill no-underline hover:bg-ink/90 transition-all duration-300 hover:scale-105 shadow-lg shadow-ink/20">
Explore Channels
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-2"> <path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path> </svg> </a> <a href="/events" class="inline-flex items-center h-12 px-8 bg-canvas text-ink text-base font-medium rounded-pill no-underline border border-hairline hover:border-hairline-strong hover:bg-canvas-soft transition-all duration-300">
View Schedule
</a> </div> </div> </div> <!-- Gradient fade at bottom --> <div class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-canvas-soft to-transparent"></div> </section>  <section class="bg-canvas-soft py-16 sm:py-20"> <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"> <div class="grid grid-cols-2 md:grid-cols-4 gap-4 stagger-children"> ${renderComponent($$result2, "StatsCard", $$StatsCard, { "label": "Total Channels", "value": channelStats.totalChannels, "icon": "channels" })} ${renderComponent($$result2, "StatsCard", $$StatsCard, { "label": "Live Channels", "value": channelStats.totalActive, "change": `${Math.round(channelStats.totalActive / channelStats.totalChannels * 100)}%`, "icon": "active" })} ${renderComponent($$result2, "StatsCard", $$StatsCard, { "label": "Categories", "value": channelStats.totalCategories, "icon": "categories" })} ${renderComponent($$result2, "StatsCard", $$StatsCard, { "label": "Events Today", "value": eventStats.totalEvents, "change": `${eventStats.uniqueCountries.length} countries`, "icon": "events" })} </div> </div> </section>  <section class="bg-canvas py-16 sm:py-20"> <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"> <div class="text-center mb-12"> <p class="text-xs font-mono text-mute uppercase tracking-widest mb-3">Categories</p> <h2 class="text-3xl sm:text-4xl font-semibold text-ink tracking-[-1.28px]">
Explore by region.
</h2> <p class="mt-3 text-body text-base max-w-lg mx-auto"> ${channelStats.totalCategories} regions with live sports channels.
</p> </div> <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 stagger-children"> ${channelStats.categories.map((cat) => renderTemplate`<a${addAttribute(`/channels/${cat.name.toLowerCase()}`, "href")} class="group bg-canvas rounded-lg card-hairline p-5 text-center no-underline transition-all duration-300 hover:shadow-elevated hover:-translate-y-0.5"> <div class="w-10 h-10 mx-auto mb-3 rounded-lg bg-canvas-soft-2 flex items-center justify-center group-hover:bg-ink group-hover:text-white transition-colors"> <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"> <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line> </svg> </div> <h3 class="text-sm font-semibold text-ink group-hover:text-link transition-colors">${cat.name}</h3> <p class="text-xs text-mute mt-1 font-mono"> ${cat.active}/${cat.total} active
</p> <!-- Mini bar --> <div class="mt-3 h-1 bg-canvas-soft-2 rounded-full overflow-hidden"> <div class="h-full bg-ink rounded-full transition-all duration-500"${addAttribute(`width: ${cat.total > 0 ? cat.active / cat.total * 100 : 0}%`, "style")}></div> </div> </a>`)} </div> </div> </section>  <section class="bg-canvas-soft py-16 sm:py-20"> <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"> <div class="flex items-end justify-between mb-10"> <div> <p class="text-xs font-mono text-mute uppercase tracking-widest mb-3">Live Now</p> <h2 class="text-3xl sm:text-4xl font-semibold text-ink tracking-[-1.28px]">
Featured channels.
</h2> </div> <a href="/channels" class="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-link no-underline hover:underline">
View all
<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg> </a> </div> ${featuredChannels.length > 0 ? renderTemplate`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children"> ${featuredChannels.map((ch, i) => renderTemplate`${renderComponent($$result2, "ChannelCard", $$ChannelCard, { "name": ch.name, "category": ch.category, "streamUrl": ch.streamUrl, "isActive": ch.isActive, "index": i })}`)} </div>` : renderTemplate`<div class="text-center py-16 text-mute"> <p>No channels available at the moment.</p> </div>`} <div class="mt-8 text-center sm:hidden"> <a href="/channels" class="inline-flex items-center h-10 px-6 bg-ink text-white text-sm font-medium rounded-pill no-underline hover:bg-ink/90 transition-colors">
View all channels
</a> </div> </div> </section>  <section class="bg-canvas py-16 sm:py-20"> <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"> <div class="flex items-end justify-between mb-10"> <div> <p class="text-xs font-mono text-mute uppercase tracking-widest mb-3">Sports Schedule</p> <h2 class="text-3xl sm:text-4xl font-semibold text-ink tracking-[-1.28px]">
Today's matches.
</h2> <p class="mt-2 text-body text-sm">${todayEvents.length} event${todayEvents.length !== 1 ? "s" : ""} scheduled</p> </div> <a href="/events" class="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-link no-underline hover:underline">
View full schedule
<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg> </a> </div> ${todayEvents.length > 0 ? renderTemplate`<div class="space-y-3 stagger-children"> ${todayEvents.slice(0, 8).map((ev, i) => renderTemplate`${renderComponent($$result2, "EventCard", $$EventCard, { "description": ev.description, "hour": ev.hour, "date": ev.date, "country": ev.country, "embeds": ev.embeds, "index": i })}`)} ${todayEvents.length > 8 && renderTemplate`<div class="text-center pt-6"> <a href="/events" class="inline-flex items-center gap-1.5 text-sm font-medium text-link no-underline hover:underline">
View all ${todayEvents.length} event${todayEvents.length !== 1 ? "s" : ""} today
<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg> </a> </div>`} </div>` : renderTemplate`<div class="text-center py-16 text-mute"> <p>No events scheduled for today.</p> </div>`} </div> </section>  <section class="bg-ink text-white py-20"> <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center"> <h2 class="text-3xl sm:text-4xl font-semibold tracking-[-1.28px]">
All football in one place.
</h2> <p class="mt-4 text-lg text-white/70 max-w-lg mx-auto"> ${channelStats.totalChannels} channels from ${channelStats.totalCategories} regions. Live streams of the most important leagues and tournaments.
</p> <div class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"> <a href="/channels" class="inline-flex items-center h-12 px-8 bg-white text-ink text-base font-medium rounded-pill no-underline hover:bg-white/90 transition-all duration-300 hover:scale-105">
Start Watching
</a> <a href="/events" class="inline-flex items-center h-12 px-8 border border-white/20 text-white text-base font-medium rounded-pill no-underline hover:bg-white/10 transition-all duration-300">
View Schedule
</a> </div> </div> </section> ` })}`;
}, "/home/dgfrii1800/football/src/pages/index.astro", void 0);

const $$file = "/home/dgfrii1800/football/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
