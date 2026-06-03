import { c as createComponent } from './astro-component_B9Kp7mio.mjs';
import 'piccolore';
import { m as maybeRenderHead, h as addAttribute, k as renderTemplate } from './entrypoint_DwogkTvv.mjs';
import 'clsx';

const $$EventCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$EventCard;
  function getEmbedUrl(embed) {
    if (embed.iframe?.url) return embed.iframe.url;
    if (embed.streamId) return "https://tvtvhd.com/vivo/canales.php?stream=" + encodeURIComponent(embed.streamId);
    return null;
  }
  const { description, hour, date, country, embeds = [], index = 0 } = Astro2.props;
  const delay = index * 80;
  return renderTemplate`${maybeRenderHead()}<div class="bg-canvas rounded-lg card-hairline p-5 transition-all duration-300 hover:shadow-elevated hover:-translate-y-0.5"${addAttribute(`animation-delay: ${delay}ms`, "style")}> <div class="flex items-start gap-4"> <!-- Time column --> <div class="shrink-0 w-16 text-center"> <div class="text-lg font-semibold text-ink leading-tight">${hour || "--:--"}</div> ${date && renderTemplate`<div class="text-[10px] font-mono text-mute uppercase tracking-wider mt-1">${date}</div>`} </div> <!-- Content --> <div class="flex-1 min-w-0"> <div class="flex items-center gap-2 mb-2"> ${country?.flag?.url && renderTemplate`<img${addAttribute(country.flag.url, "src")}${addAttribute(country.name || "", "alt")} class="w-5 h-4 rounded object-cover" loading="lazy">`} ${country?.name && renderTemplate`<span class="text-xs font-mono text-mute uppercase tracking-wider">${country.name}</span>`} </div> <h3 class="text-sm font-medium text-ink leading-snug"> ${description || "Unnamed event"} </h3> <!-- Embeds - clickable to our player when streamId is found --> ${embeds.length > 0 && renderTemplate`<div class="flex flex-wrap gap-1.5 mt-3"> ${embeds.map((embed) => {
    const href = embed.streamId ? `/stream/${embed.streamId}` : null;
    const embedUrl = getEmbedUrl(embed);
    return href || embedUrl ? renderTemplate`<a${addAttribute(href || embedUrl, "href")}${addAttribute(embed.streamId || "", "data-stream-id")}${addAttribute(embed.name || "", "data-channel-name")}${addAttribute(embedUrl || "", "data-embed-url")} class="inline-flex items-center gap-1 px-2.5 py-1 bg-canvas-soft-2 text-xs font-medium text-body rounded-full no-underline hover:text-ink hover:bg-hairline transition-colors group"> <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="group-hover:text-link transition-colors"> <polygon points="5 3 19 12 5 21 5 3"></polygon> </svg> ${embed.name || "Stream"} </a>` : renderTemplate`<span class="inline-flex items-center gap-1 px-2.5 py-1 bg-canvas-soft-2 text-xs text-mute rounded-full"> ${embed.name || "Stream"} </span>`;
  })} </div>`} </div> <!-- Arrow indicator --> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" class="shrink-0 text-hairline-strong mt-1 hidden sm:block"> <path d="m9 18 6-6-6-6"></path> </svg> </div> </div>`;
}, "/home/dgfrii1800/football/src/components/EventCard.astro", void 0);

export { $$EventCard as $ };
