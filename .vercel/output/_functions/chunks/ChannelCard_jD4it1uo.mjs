import { c as createComponent } from './astro-component_DJn0TBVV.mjs';
import 'piccolore';
import { m as maybeRenderHead, h as addAttribute, k as renderTemplate } from './entrypoint_Bi04DfOe.mjs';
import 'clsx';
import { e as extractStreamId } from './index_-JAiwH9B.mjs';

const $$ChannelCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$ChannelCard;
  const { name, category, streamUrl, isActive, index = 0 } = Astro2.props;
  const streamId = extractStreamId(streamUrl) || "";
  const delay = index * 60;
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(`/stream/${streamId}`, "href")} class="group block bg-canvas rounded-lg card-hairline p-5 no-underline transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elevated"${addAttribute(`animation-delay: ${delay}ms`, "style")}> <div class="flex items-start justify-between gap-3 mb-3"> <div class="flex-1 min-w-0"> <h3 class="text-sm font-semibold text-ink truncate group-hover:text-link transition-colors"> ${name} </h3> <p class="text-xs text-mute mt-0.5 font-mono uppercase tracking-wider truncate"> ${category} </p> </div> <span${addAttribute(`shrink-0 inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-mono font-medium rounded-full ${isActive ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-400"}`, "class")}> <span${addAttribute(`w-1.5 h-1.5 rounded-full ${isActive ? "bg-green-500 animate-pulse" : "bg-gray-300"}`, "class")}></span> ${isActive ? "Live" : "Inactive"} </span> </div> <div class="flex items-center gap-2 text-xs text-mute font-mono"> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"> <polygon points="5 3 19 12 5 21 5 3"></polygon> </svg> <span>${isActive ? "Streaming live" : "No stream"}</span> </div> <!-- Hover indicator --> <div class="mt-3 pt-3 border-t border-hairline opacity-0 group-hover:opacity-100 transition-opacity"> <span class="text-xs font-medium text-link flex items-center gap-1">
Watch stream
<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path> </svg> </span> </div> </a>`;
}, "/home/dgfrii1800/football/src/components/ChannelCard.astro", void 0);

export { $$ChannelCard as $ };
