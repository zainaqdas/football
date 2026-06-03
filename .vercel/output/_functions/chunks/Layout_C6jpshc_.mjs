import { c as createComponent } from './astro-component_D0JB_oF9.mjs';
import 'piccolore';
import { q as createRenderInstruction, h as addAttribute, v as renderHead, w as renderSlot, k as renderTemplate } from './entrypoint_Bkn4krmA.mjs';
import 'clsx';

async function renderScript(result, id) {
  const inlined = result.inlinedScripts.get(id);
  let content = "";
  if (inlined != null) {
    if (inlined) {
      content = `<script type="module">${inlined}</script>`;
    }
  } else {
    const resolved = await result.resolve(id);
    content = `<script type="module" src="${result.userAssetsBase ? (result.base === "/" ? "" : result.base) + result.userAssetsBase : ""}${resolved}"></script>`;
  }
  return createRenderInstruction({ type: "script", id, content });
}

let en = null;
let es = null;
async function loadLocale(locale) {
  if (locale === "es") {
    if (!es) es = (await import('./es_E4w6H98o.mjs')).default;
    return es;
  }
  if (!en) en = (await import('./en_CpNGax0y.mjs')).default;
  return en;
}
function detectLocale(cookies, acceptLanguage) {
  const cookie = cookies.get("lang")?.value;
  if (cookie === "es" || cookie === "en") return cookie;
  if (acceptLanguage) {
    if (acceptLanguage.startsWith("es")) return "es";
  }
  return "en";
}
function createTranslator(dict) {
  return function t(key, vars) {
    const parts = key.split(".");
    let value = dict;
    for (const part of parts) {
      if (value && typeof value === "object" && part in value) {
        value = value[part];
      } else {
        return key;
      }
    }
    if (typeof value !== "string") return key;
    if (vars) {
      return value.replace(/\{(\w+)\}/g, (_, name) => {
        return name in vars ? String(vars[name]) : `{${name}}`;
      });
    }
    return value;
  };
}
async function getTranslations(locale) {
  const dict = await loadLocale(locale);
  return {
    t: createTranslator(dict),
    locale,
    isSpanish: locale === "es"
  };
}

const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Layout;
  const { title = "Fútbol Libre TV — Live Football Streaming", description = "Watch live football matches from leagues around the world. Browse channels, schedules, and streams in HD quality." } = Astro2.props;
  const currentLocale = Astro2.props.locale || detectLocale(Astro2.cookies, Astro2.request.headers.get("accept-language"));
  const langAttr = currentLocale === "es" ? "es" : "en";
  const ogLocale = currentLocale === "es" ? "es_LA" : "en_US";
  return renderTemplate`<html${addAttribute(langAttr, "lang")}> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description"${addAttribute(description, "content")}><meta name="robots" content="index, follow"><meta name="googlebot" content="index, follow"><meta name="theme-color" content="#0f172a"><!-- Open Graph --><meta property="og:title"${addAttribute(title, "content")}><meta property="og:description"${addAttribute(description, "content")}><meta property="og:type" content="website"><meta property="og:locale"${addAttribute(ogLocale, "content")}><!-- Twitter --><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title"${addAttribute(title, "content")}><meta name="twitter:description"${addAttribute(description, "content")}><!-- Preconnect --><link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin><link rel="preconnect" href="https://tvtvhd.com"><link rel="preconnect" href="https://pltvhd.com"><!-- Fonts --><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet"><!-- Icons --><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="icon" href="/favicon.ico"><title>${title}</title>${renderHead()}</head> <body class="min-h-screen bg-canvas-soft text-ink antialiased"> <!-- Navigation --> <nav class="fixed top-0 left-0 right-0 z-50 h-16 bg-canvas/80 backdrop-blur-md border-b border-hairline"> <div class="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"> <a href="/" class="flex items-center gap-2 font-semibold text-ink no-underline hover:opacity-80 transition-opacity"> <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <circle cx="12" cy="12" r="10"></circle> <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path> <path d="M2 12h20"></path> </svg> <span class="hidden sm:inline">Fútbol Libre</span> </a> <!-- Desktop nav --> <div class="hidden md:flex items-center gap-1"> <a href="/" class="nav-link" data-i18n="nav.home">${currentLocale === "es" ? "Inicio" : "Home"}</a> <a href="/channels" class="nav-link" data-i18n="nav.channels">${currentLocale === "es" ? "Canales" : "Channels"}</a> <a href="/events" class="nav-link" data-i18n="nav.events">${currentLocale === "es" ? "Eventos" : "Events"}</a> </div> <!-- Desktop right side --> <div class="hidden md:flex items-center gap-2"> <!-- Language switcher --> <a href="/api/set-lang?lang={otherLocale}&redirect={Astro.request.url}" class="inline-flex items-center h-7 px-2 text-xs font-mono font-medium text-mute hover:text-ink rounded-sm no-underline hover:bg-canvas-soft border border-hairline transition-colors" aria-label="Switch language"> ${currentLocale === "es" ? "EN" : "ES"} </a> <a href="/channels" class="inline-flex items-center h-7 px-2 bg-ink text-white text-sm font-medium rounded-sm no-underline hover:bg-ink/90 transition-colors" data-i18n="nav.watch"> ${currentLocale === "es" ? "Ver Canales" : "Watch"} </a> </div> <!-- Mobile hamburger --> <button id="menu-toggle" class="md:hidden flex items-center justify-center w-9 h-9 rounded-full border border-hairline bg-canvas text-ink cursor-pointer hover:bg-canvas-soft transition-colors" aria-label="Toggle menu" aria-expanded="false"> <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"> <line x1="3" y1="6" x2="21" y2="6"></line> <line x1="3" y1="12" x2="21" y2="12"></line> <line x1="3" y1="18" x2="21" y2="18"></line> </svg> </button> </div> </nav> <!-- Mobile menu overlay --> <div id="mobile-menu" class="fixed inset-0 z-40 hidden bg-canvas/98 backdrop-blur-sm"> <div class="flex flex-col items-center justify-center h-full gap-8"> <a href="/" class="text-2xl font-semibold no-underline hover:text-body transition-colors" onclick="closeMenu()" data-i18n="nav.home">${currentLocale === "es" ? "Inicio" : "Home"}</a> <a href="/channels" class="text-2xl font-semibold no-underline hover:text-body transition-colors" onclick="closeMenu()" data-i18n="nav.channels">${currentLocale === "es" ? "Canales" : "Channels"}</a> <a href="/events" class="text-2xl font-semibold no-underline hover:text-body transition-colors" onclick="closeMenu()" data-i18n="nav.events">${currentLocale === "es" ? "Eventos" : "Events"}</a> <!-- Mobile language switcher --> <a href="/api/set-lang?lang={otherLocale}&redirect={Astro.request.url}" class="inline-flex items-center gap-2 h-10 px-6 text-sm font-mono font-medium text-mute no-underline border border-hairline rounded-pill hover:text-ink hover:bg-canvas-soft transition-colors"> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"></circle><path d="M2 12h20"></path><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg> ${currentLocale === "es" ? "English" : "Español"} </a> <a href="/channels" class="mt-4 inline-flex items-center h-10 px-6 bg-ink text-white text-base font-medium rounded-pill no-underline hover:bg-ink/90 transition-colors" data-i18n="nav.watch"> ${currentLocale === "es" ? "Ver Canales" : "Watch"} </a> <button id="menu-close" class="mt-8 text-sm text-mute hover:text-body transition-colors cursor-pointer bg-transparent border-none" onclick="closeMenu()" data-i18n="nav.close">${currentLocale === "es" ? "Cerrar" : "Close"}</button> </div> </div> <!-- Main content --> <main class="pt-16"> ${renderSlot($$result, $$slots["default"])} </main> <!-- Footer --> <footer class="border-t border-hairline bg-canvas"> <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16"> <div class="grid grid-cols-2 md:grid-cols-4 gap-8"> <div> <h4 class="text-xs font-mono text-mute uppercase tracking-wider mb-4">${currentLocale === "es" ? "Navegación" : "Navigation"}</h4> <ul class="space-y-3"> <li><a href="/" class="text-sm text-body no-underline hover:text-ink transition-colors" data-i18n="nav.home">${currentLocale === "es" ? "Inicio" : "Home"}</a></li> <li><a href="/channels" class="text-sm text-body no-underline hover:text-ink transition-colors" data-i18n="nav.channels">${currentLocale === "es" ? "Canales" : "Channels"}</a></li> <li><a href="/events" class="text-sm text-body no-underline hover:text-ink transition-colors" data-i18n="nav.events">${currentLocale === "es" ? "Eventos" : "Events"}</a></li> </ul> </div> <div> <h4 class="text-xs font-mono text-mute uppercase tracking-wider mb-4">${currentLocale === "es" ? "Canales" : "Channels"}</h4> <ul class="space-y-3"> <li><a href="/channels/argentina" class="text-sm text-body no-underline hover:text-ink transition-colors">${currentLocale === "es" ? "Argentina" : "Argentina"}</a></li> <li><a href="/channels/mexico" class="text-sm text-body no-underline hover:text-ink transition-colors">${currentLocale === "es" ? "México" : "Mexico"}</a></li> <li><a href="/channels/espana" class="text-sm text-body no-underline hover:text-ink transition-colors">${currentLocale === "es" ? "España" : "Spain"}</a></li> <li><a href="/channels/usa" class="text-sm text-body no-underline hover:text-ink transition-colors">USA</a></li> </ul> </div> <div> <h4 class="text-xs font-mono text-mute uppercase tracking-wider mb-4">${currentLocale === "es" ? "Regiones" : "Regions"}</h4> <ul class="space-y-3"> <li><a href="/channels/latinoamerica" class="text-sm text-body no-underline hover:text-ink transition-colors">${currentLocale === "es" ? "Latinoamérica" : "Latin America"}</a></li> <li><a href="/channels/brasil" class="text-sm text-body no-underline hover:text-ink transition-colors">${currentLocale === "es" ? "Brasil" : "Brazil"}</a></li> <li><a href="/channels/portugal" class="text-sm text-body no-underline hover:text-ink transition-colors">${currentLocale === "es" ? "Portugal" : "Portugal"}</a></li> <li><a href="/channels/mundo" class="text-sm text-body no-underline hover:text-ink transition-colors">${currentLocale === "es" ? "Mundo" : "World"}</a></li> </ul> </div> <div> <h4 class="text-xs font-mono text-mute uppercase tracking-wider mb-4">${currentLocale === "es" ? "Información" : "Info"}</h4> <ul class="space-y-3"> <li><span class="text-sm text-mute">Fútbol Libre TV</span></li> <li><span class="text-sm text-mute">${currentLocale === "es" ? "Canales en vivo y partidos" : "Live channels & matches"}</span></li> <li><span class="text-sm text-mute">${currentLocale === "es" ? "Transmisiones en HD" : "HD streaming"}</span></li> </ul> </div> </div> <div class="mt-12 pt-8 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-4"> <p class="text-sm text-mute">${currentLocale === "es" ? `© ${(/* @__PURE__ */ new Date()).getFullYear()} Fútbol Libre TV. Todos los derechos reservados.` : `© ${(/* @__PURE__ */ new Date()).getFullYear()} Fútbol Libre TV. All rights reserved.`}</p> <p class="text-xs text-mute font-mono">v1.0.0</p> </div> </div> </footer> ${renderScript($$result, "/home/dgfrii1800/football/src/layouts/Layout.astro?astro&type=script&index=0&lang.ts")} </body> </html>`;
}, "/home/dgfrii1800/football/src/layouts/Layout.astro", void 0);

export { $$Layout as $, detectLocale as d, getTranslations as g };
