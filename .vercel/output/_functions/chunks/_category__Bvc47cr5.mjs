import { c as createComponent } from './astro-component_C8iFBoj9.mjs';
import 'piccolore';
import { o as renderComponent, k as renderTemplate, m as maybeRenderHead, p as Fragment, h as addAttribute } from './entrypoint_DlJc2ilo.mjs';
import { $ as $$Layout } from './Layout_D9ZdTp5X.mjs';
import { $ as $$ChannelCard } from './ChannelCard_jicwFATU.mjs';
import { T as TVTVHDScraper } from './index_-JAiwH9B.mjs';

const $$category = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$category;
  const { category } = Astro2.params;
  const scraper = new TVTVHDScraper();
  let channels = null;
  let originalName = category || "";
  try {
    channels = await scraper.getChannelsByCategoryName(category || "");
    if (channels && channels.length > 0) {
      originalName = channels[0].category;
    }
  } catch {
    channels = null;
  }
  const sortedChannels = channels ? [...channels] : [];
  sortedChannels.sort((a, b) => {
    if (a.isActive !== b.isActive) return a.isActive ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
  const activeCount = sortedChannels.filter((c) => c.isActive).length;
  const inactiveCount = sortedChannels.filter((c) => !c.isActive).length;
  const hasChannels = channels && channels.length > 0;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `${originalName} — Canales en Vivo — Fútbol Libre TV`, "description": `Canales de ${originalName} en vivo. ${activeCount} canales activos de ${sortedChannels.length} totales.` }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="bg-canvas border-b border-hairline"> <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14"> <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-6"> <div> <p class="text-xs font-mono text-mute uppercase tracking-widest mb-2">Canales</p> <h1 class="text-3xl sm:text-4xl font-semibold text-ink tracking-[-1.28px]"> ${originalName} </h1> <p class="mt-1 text-sm text-body"> ${hasChannels ? `${sortedChannels.length} canales · ${activeCount} en vivo` : "Categoría no encontrada"} </p> </div> <a href="/channels" class="inline-flex items-center gap-1.5 text-sm font-medium text-link no-underline hover:underline shrink-0"> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M19 12H5"></path><path d="m12 19-7-7 7-7"></path></svg>
Todas las categorías
</a> </div> </div> </section> ${hasChannels ? renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <section class="bg-canvas-soft border-b border-hairline"> <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4"> <div class="flex items-center gap-6 text-sm"> <div class="flex items-center gap-2"> <span class="w-2 h-2 rounded-full bg-green-500"></span> <span class="text-body">${activeCount} activos</span> </div> <div class="flex items-center gap-2"> <span class="w-2 h-2 rounded-full bg-gray-300"></span> <span class="text-body">${inactiveCount} inactivos</span> </div> <div class="text-mute font-mono text-xs ml-auto"> ${Math.round(activeCount / sortedChannels.length * 100)}% en vivo
</div> </div> <div class="mt-3 h-1.5 bg-canvas-soft-2 rounded-full overflow-hidden"> <div class="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-1000"${addAttribute(`width: ${activeCount / sortedChannels.length * 100}%`, "style")}></div> </div> </div> </section> <section class="bg-canvas-soft pb-16 sm:pb-20 pt-8"> <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"> ${activeCount > 0 && renderTemplate`${renderComponent($$result3, "Fragment", Fragment, {}, { "default": async ($$result4) => renderTemplate` <h2 class="text-sm font-semibold text-ink mb-4 flex items-center gap-2"> <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
En Vivo (${activeCount})
</h2> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-10 stagger-children"> ${sortedChannels.filter((c) => c.isActive).map((ch, i) => renderTemplate`${renderComponent($$result4, "ChannelCard", $$ChannelCard, { "name": ch.name, "category": ch.category, "streamUrl": ch.streamUrl, "isActive": ch.isActive, "index": i })}`)} </div> ` })}`} ${inactiveCount > 0 && renderTemplate`${renderComponent($$result3, "Fragment", Fragment, {}, { "default": async ($$result4) => renderTemplate` <h2 class="text-sm font-semibold text-mute mb-4">Inactivos (${inactiveCount})</h2> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children"> ${sortedChannels.filter((c) => !c.isActive).map((ch, i) => renderTemplate`${renderComponent($$result4, "ChannelCard", $$ChannelCard, { "name": ch.name, "category": ch.category, "streamUrl": ch.streamUrl, "isActive": ch.isActive, "index": i + activeCount })}`)} </div> ` })}`} </div> </section> ` })}` : renderTemplate`<section class="bg-canvas-soft pb-16 sm:pb-20 pt-16"> <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"> <div class="text-center py-20"> <div class="w-16 h-16 mx-auto mb-6 rounded-2xl bg-canvas-soft-2 flex items-center justify-center"> <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" class="text-mute"> <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line> </svg> </div> <h3 class="text-lg font-semibold text-ink mb-2">Categoría no encontrada</h3> <p class="text-sm text-mute mb-6">La categoría "${originalName}" no existe o no tiene canales disponibles.</p> <a href="/channels" class="inline-flex items-center h-10 px-6 bg-ink text-white text-sm font-medium rounded-pill no-underline hover:bg-ink/90 transition-colors">
Explorar canales
</a> </div> </div> </section>`}` })}`;
}, "/home/dgfrii1800/football/src/pages/channels/[category].astro", void 0);

const $$file = "/home/dgfrii1800/football/src/pages/channels/[category].astro";
const $$url = "/channels/[category]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$category,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
