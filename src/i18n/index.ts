import type { AstroCookies } from 'astro';

// Translation dictionaries
let en: Record<string, any> | null = null;
let es: Record<string, any> | null = null;

async function loadLocale(locale: string): Promise<Record<string, any>> {
  if (locale === 'es') {
    if (!es) es = (await import('./es.json')).default;
    return es;
  }
  if (!en) en = (await import('./en.json')).default;
  return en;
}

/**
 * Detect the user's language preference.
 * Priority: URL param `lang` > cookie `lang` > Accept-Language header > 'en'
 */
export function detectLocale(
  cookies: AstroCookies,
  acceptLanguage?: string | null,
): string {
  // Check cookie first (set by language switcher)
  const cookie = cookies.get('lang')?.value;
  if (cookie === 'es' || cookie === 'en') return cookie;

  // Check Accept-Language header
  if (acceptLanguage) {
    if (acceptLanguage.startsWith('es')) return 'es';
  }

  return 'en';
}

/**
 * Simple nested key lookup with {variable} interpolation.
 * Example: t('hero.title') or t('stats.liveChannels')
 */
export function createTranslator(dict: Record<string, any>) {
  return function t(key: string, vars?: Record<string, string | number>): string {
    const parts = key.split('.');
    let value: any = dict;
    for (const part of parts) {
      if (value && typeof value === 'object' && part in value) {
        value = value[part];
      } else {
        return key; // fallback to key
      }
    }
    if (typeof value !== 'string') return key;

    // Replace {variables}
    if (vars) {
      return value.replace(/\{(\w+)\}/g, (_, name) => {
        return name in vars ? String(vars[name]) : `{${name}}`;
      });
    }
    return value;
  };
}

export type TranslateFn = ReturnType<typeof createTranslator>;

/**
 * Get translations for a locale. Returns a `t` function and locale info.
 */
export async function getTranslations(locale: string) {
  const dict = await loadLocale(locale);
  return {
    t: createTranslator(dict),
    locale,
    isSpanish: locale === 'es',
  };
}
