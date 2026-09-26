import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db/firestore'

// Without this, Next.js would cache the response at build time and the
// map/stats would freeze at whatever they were on the last deploy.
export const dynamic = 'force-dynamic'

interface VisitorRow {
  country: string
  countryCode: string
  city: string
  latitude: number
  longitude: number
  visitCount: number
  firstSeenAt: Date
  lastSeenAt: Date
}

function startOfDay(d: Date) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

export async function GET() {
  try {
    const db = getDb()
    const snap = await db
      .collection('siteVisitors')
      .select('country', 'countryCode', 'city', 'latitude', 'longitude', 'visitCount', 'firstSeenAt', 'lastSeenAt')
      .get()

    const rows: VisitorRow[] = snap.docs.map((doc) => {
      const d = doc.data()
      return {
        country: d.country || 'Unknown',
        countryCode: d.countryCode || 'XX',
        city: d.city || '',
        latitude: typeof d.latitude === 'number' ? d.latitude : 0,
        longitude: typeof d.longitude === 'number' ? d.longitude : 0,
        visitCount: d.visitCount || 1,
        firstSeenAt: d.firstSeenAt?.toDate ? d.firstSeenAt.toDate() : new Date(d.firstSeenAt),
        lastSeenAt: d.lastSeenAt?.toDate ? d.lastSeenAt.toDate() : new Date(d.lastSeenAt),
      }
    })

    const todayStart = startOfDay(new Date())

    const totalVisitors = rows.length
    const totalVisits = rows.reduce((sum, r) => sum + r.visitCount, 0)
    const newToday = rows.filter((r) => r.firstSeenAt >= todayStart).length

    const countryCodes = new Set(rows.map((r) => r.countryCode).filter((c) => c && c !== 'XX'))
    const totalCountries = countryCodes.size

    // Top countries — grouped for the "reached" leaderboard panel.
    const countryMap = new Map<string, { country: string; countryCode: string; visitors: number; visits: number }>()
    for (const r of rows) {
      if (!r.countryCode || r.countryCode === 'XX') continue
      const existing = countryMap.get(r.countryCode)
      if (existing) {
        existing.visitors += 1
        existing.visits += r.visitCount
      } else {
        countryMap.set(r.countryCode, {
          country: r.country,
          countryCode: r.countryCode,
          visitors: 1,
          visits: r.visitCount,
        })
      }
    }
    const topCountries = Array.from(countryMap.values())
      .sort((a, b) => b.visitors - a.visitors)
      .slice(0, 10)

    // Map markers — nearby visitors (within ~0.5°, roughly city-sized) are
    // clustered into a single point sized by count, so the map stays
    // readable instead of stacking hundreds of overlapping dots.
    const markerMap = new Map<
      string,
      { lat: number; lng: number; city: string; country: string; countryCode: string; count: number }
    >()
    for (const r of rows) {
      if (!r.latitude || !r.longitude) continue
      const lat = Math.round(r.latitude * 2) / 2
      const lng = Math.round(r.longitude * 2) / 2
      const key = `${lat},${lng}`
      const existing = markerMap.get(key)
      if (existing) {
        existing.count += 1
      } else {
        markerMap.set(key, { lat, lng, city: r.city, country: r.country, countryCode: r.countryCode, count: 1 })
      }
    }
    const markers = Array.from(markerMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 400)

    // Recent-activity ticker — most recently active visitors.
    const recentVisitors = [...rows]
      .sort((a, b) => b.lastSeenAt.getTime() - a.lastSeenAt.getTime())
      .slice(0, 8)
      .map((r) => ({
        city: r.city,
        country: r.country,
        countryCode: r.countryCode,
        lastSeenAt: r.lastSeenAt,
      }))

    return NextResponse.json({
      totalVisitors,
      totalVisits,
      totalCountries,
      newToday,
      topCountries,
      markers,
      recentVisitors,
    })
  } catch (error) {
    console.error('Visitor stats error:', error)
    return NextResponse.json({ error: 'Something went wrong loading visitor stats.' }, { status: 500 })
  }
}
