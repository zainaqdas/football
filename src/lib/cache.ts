/**
 * Simple in-memory TTL cache for server-side data.
 *
 * Works across concurrent requests within the same serverless instance.
 * On Vercel, each function instance has its own cache, so different
 * instances may independently fetch fresh data – this is fine: it
 * reduces scraper calls without risking staleness.
 *
 * Also deduplicates concurrent cache misses so the same key only
 * triggers one fetch at a time.
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const store = new Map<string, CacheEntry<any>>();
const pending = new Map<string, Promise<any>>();

/** Get a cached value. Returns null if missing or expired. */
export function getCached<T>(key: string): T | null {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.data;
}

/** Set a cached value with a TTL in milliseconds. */
export function setCache<T>(key: string, data: T, ttlMs: number): void {
  store.set(key, { data, expiresAt: Date.now() + ttlMs });
}

/**
 * Get a cached value, or compute and cache it if missing/expired.
 * Concurrent calls for the same key are deduplicated.
 *
 * @param key   Unique cache key (e.g. `channels.all`, `events.all`)
 * @param ttlMs Time-to-live in milliseconds
 * @param fn    Async function to compute the value on cache miss
 */
export async function withCache<T>(
  key: string,
  ttlMs: number,
  fn: () => Promise<T>,
): Promise<T> {
  const cached = getCached<T>(key);
  if (cached !== null) return cached;

  const existing = pending.get(key);
  if (existing) return existing as Promise<T>;

  const promise = fn()
    .then((data) => {
      setCache(key, data, ttlMs);
      pending.delete(key);
      return data;
    })
    .catch((err) => {
      pending.delete(key);
      throw err;
    });

  pending.set(key, promise);
  return promise;
}

/** Clear all cached entries (useful for testing). */
export function clearCache(): void {
  store.clear();
  pending.clear();
}
