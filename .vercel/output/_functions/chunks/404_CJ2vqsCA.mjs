import { c as createComponent } from './astro-component_DJn0TBVV.mjs';
import 'piccolore';
import { o as renderComponent, k as renderTemplate, m as maybeRenderHead } from './entrypoint_Bi04DfOe.mjs';
import { $ as $$Layout } from './Layout_BxoymiiG.mjs';

const $$404 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Page not found — 404 — Fútbol Libre TV", "description": "The page you are looking for does not exist." }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="min-h-[calc(100vh-16rem)] flex items-center justify-center bg-canvas-soft"> <div class="mx-auto max-w-md px-4 text-center"> <div class="w-20 h-20 mx-auto mb-8 rounded-2xl bg-canvas-soft-2 flex items-center justify-center"> <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" class="text-mute"> <circle cx="12" cy="12" r="10"></circle><path d="m15 9-6 6"></path><path d="m9 9 6 6"></path> </svg> </div> <p class="text-xs font-mono text-mute uppercase tracking-widest mb-4">Error 404</p> <h1 class="text-3xl sm:text-4xl font-semibold text-ink tracking-[-1.28px] mb-4">
Page not found.
</h1> <p class="text-body text-base leading-relaxed mb-8">
The page you are looking for doesn't exist or has been moved. Check the URL or go back home to find what you need.
</p> <div class="flex flex-col sm:flex-row items-center justify-center gap-4"> <a href="/" class="inline-flex items-center h-10 px-6 bg-ink text-white text-sm font-medium rounded-pill no-underline hover:bg-ink/90 transition-colors">
Go Home
</a> <a href="/channels" class="inline-flex items-center h-10 px-6 bg-canvas text-ink text-sm font-medium rounded-pill no-underline border border-hairline hover:border-hairline-strong transition-colors">
Browse Channels
</a> </div> </div> </section> ` })}`;
}, "/home/dgfrii1800/football/src/pages/404.astro", void 0);

const $$file = "/home/dgfrii1800/football/src/pages/404.astro";
const $$url = "/404";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$404,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
