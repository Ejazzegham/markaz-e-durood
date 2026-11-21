// Small server-side cache that protects Firestore's daily read quota.
//
// Why this exists: /api/durood/stats and /api/visitors/stats read EVERY
// document in a collection on each call. Without caching, every visitor
// and every app user re-triggers that full scan every few seconds, which
// burns through Firestore's free 50,000 reads/day and then every request
// fails with "8 RESOURCE_EXHAUSTED: Quota exceeded".
//
// What it does:
//  - Serves a cached value for `ttlMs` instead of calling Firestore.
//  - Collapses simultaneous requests into one Firestore call.
//  - If Firestore fails, serves the last good (stale) value instead of an error.
//  - If Firestore reports quota exhausted, stops calling it for a cooldown
//    period so we don't keep hammering it while it is blocked.

type Entry = { value: unknown; at: number }

interface CacheState {
  store: Map<string, Entry>
  inflight: Map<string, Promise<unknown>>
  blockedUntil: number
}

const g = globalThis as unknown as { __ttlCache?: CacheState }
const state: CacheState =
  g.__ttlCache ?? (g.__ttlCache = { store: new Map(), inflight: new Map(), blockedUntil: 0 })

const QUOTA_COOLDOWN_MS = 15 * 60 * 1000

function isQuotaError(err: unknown): boolean {
  const e = err as { code?: number | string; message?: string } | null
  if (!e) return false
  if (e.code === 8 || e.code === 'resource-exhausted') return true
  return typeof e.message === 'string' && e.message.includes('RESOURCE_EXHAUSTED')
}

export function envSeconds(name: string, fallback: number): number {
  const raw = Number(process.env[name])
  return Number.isFinite(raw) && raw > 0 ? raw : fallback
}

export interface CachedResult<T> {
  value: T
  stale: boolean
}

export async function cached<T>(
  key: string,
  ttlMs: number,
  loader: () => Promise<T>
): Promise<CachedResult<T>> {
  const now = Date.now()
  const hit = state.store.get(key)

  if (hit && now - hit.at < ttlMs) {
    return { value: hit.value as T, stale: false }
  }

  // Firestore recently said "quota exceeded" — don't call it again yet.
  if (now < state.blockedUntil) {
    if (hit) return { value: hit.value as T, stale: true }
    throw new Error('Database quota is exhausted; retry later.')
  }

  const running = state.inflight.get(key)
  if (running) {
    return { value: (await running) as T, stale: false }
  }

  const promise = (async () => {
    try {
      const value = await loader()
      state.store.set(key, { value, at: Date.now() })
      return value
    } finally {
      state.inflight.delete(key)
    }
  })()
  state.inflight.set(key, promise)

  try {
    return { value: (await promise) as T, stale: false }
  } catch (err) {
    if (isQuotaError(err)) {
      state.blockedUntil = Date.now() + QUOTA_COOLDOWN_MS
      console.error('Firestore quota exhausted — pausing reads for 15 minutes.')
    }
    if (hit) {
      console.error(`Serving stale cache for "${key}" after error:`, (err as Error)?.message)
      return { value: hit.value as T, stale: true }
    }
    throw err
  }
}

// Headers so Vercel's CDN (and browsers) also cache the response, which keeps
// most traffic from even reaching the function.
export function cacheHeaders(ttlSeconds: number): Record<string, string> {
  return {
    'Cache-Control': `public, max-age=20, s-maxage=${ttlSeconds}, stale-while-revalidate=${ttlSeconds * 6}`,
  }
}
