import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { getDb } from '@/lib/db/firestore'
import { geolocateIp } from '@/lib/geo/ipGeolocate'
import { hashIp } from '@/lib/geo/hashIp'

export const dynamic = 'force-dynamic'

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) return forwardedFor.split(',')[0].trim()
  return request.headers.get('x-real-ip') || 'unknown'
}

// Fired once per visitor (see VisitorTracker.tsx, which guards this to
// roughly once per browser per day via localStorage) to power the
// "Visitors Worldwide" map and stats on the homepage. Geolocation only
// runs for genuinely new visitors — a returning visitor just increments
// their existing counter, so we never re-hit the external geo API for
// people we've already placed on the map.
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    const docId = hashIp(ip)
    const db = getDb()
    const ref = db.collection('siteVisitors').doc(docId)
    const existing = await ref.get()
    const now = new Date()

    if (existing.exists) {
      await ref.update({
        visitCount: FieldValue.increment(1),
        lastSeenAt: now,
      })
      return NextResponse.json({ ok: true, new: false })
    }

    const geo = await geolocateIp(ip)
    if (!geo) {
      // Couldn't place this visitor on the map (private IP, lookup
      // failed, etc.) — don't create a record with junk coordinates.
      return NextResponse.json({ ok: true, new: false, located: false })
    }

    await ref.set({
      country: geo.country,
      countryCode: geo.countryCode,
      city: geo.city,
      latitude: geo.latitude,
      longitude: geo.longitude,
      visitCount: 1,
      firstSeenAt: now,
      lastSeenAt: now,
    })

    return NextResponse.json({ ok: true, new: true })
  } catch (error) {
    console.error('Visitor tracking error:', error)
    // Never let analytics failures surface to the visitor.
    return NextResponse.json({ ok: false })
  }
}
