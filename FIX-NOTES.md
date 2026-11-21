# Fix: "RESOURCE_EXHAUSTED: Quota exceeded" (visitor map + Durood counter blank)

Cause: Firestore's free plan allows ~50,000 document reads per day. Your stats
endpoints read EVERY document on every call, and every visitor / app user called
them every 20-45 seconds, so the quota ran out.

What changed
- src/lib/cache/ttlCache.ts (new): server cache. Serves saved numbers for a few
  minutes, merges simultaneous requests, serves the last good numbers if
  Firestore fails, and pauses Firestore calls for 15 min after a quota error.
- durood/stats, visitors/stats, content/[model]: use that cache + CDN cache headers.
- Home page, Durood counter page, leaderboard, visitor map: refresh every 2-3
  minutes (was 20-45 s), only while the tab is visible, and keep the last good
  numbers instead of showing 0 or breaking when the server returns an error.

Optional Vercel environment variables (defaults shown)
- STATS_CACHE_SECONDS=300      Durood counter numbers
- VISITORS_CACHE_SECONDS=900   Visitor map numbers
- CONTENT_CACHE_SECONDS=180    Naat / blog / news lists
Larger numbers = fewer database reads but slower updates.

After deploying
- The quota resets daily (midnight Pacific Time). Until it resets, the site shows
  the last cached numbers once it has any.
- Strongly recommended: Firebase Console > Usage and billing > upgrade to Blaze
  (pay as you go). You keep the same free daily amounts; reads beyond them cost
  about $0.06 per 100,000, so a busy site is typically cents per month. Set a
  budget alert so you are never surprised.
