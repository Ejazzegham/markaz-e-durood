// Server-side IP → approximate location lookup, used to plot new visitors
// on the "Visitors Worldwide" map. Uses GeoJS (https://www.geojs.io) — a
// free, keyless, HTTPS geolocation API — so no paid GeoIP database or API
// key is required. Only ever called once per *new* unique visitor (see
// /api/visitors/track), never on every page view, to stay well within
// reasonable use.

export interface GeoResult {
  country: string
  countryCode: string
  city: string
  latitude: number
  longitude: number
}

// Requests from localhost / private networks / the dev machine itself
// can't be geolocated — there's no point calling out for them.
function isPrivateOrLocalIp(ip: string): boolean {
  const v = ip.trim().toLowerCase()
  if (!v || v === 'unknown' || v === '::1' || v === '127.0.0.1') return true
  if (v.startsWith('10.') || v.startsWith('192.168.') || v.startsWith('169.254.')) return true
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(v)) return true
  if (v.startsWith('fc') || v.startsWith('fd') || v.startsWith('fe80')) return true
  return false
}

export async function geolocateIp(ip: string): Promise<GeoResult | null> {
  if (isPrivateOrLocalIp(ip)) return null

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 4000)

    const res = await fetch(`https://get.geojs.io/v1/ip/geo/${encodeURIComponent(ip)}.json`, {
      signal: controller.signal,
      // This is a fresh lookup for a brand-new visitor — never cache.
      cache: 'no-store',
    })
    clearTimeout(timeout)
    if (!res.ok) return null

    const data = await res.json()

    const latitude = parseFloat(data.latitude)
    const longitude = parseFloat(data.longitude)
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null

    const countryCode = String(data.country_code || data.country?.code || 'XX').toUpperCase()
    const country = String(data.country?.name || data.country || 'Unknown')
    const city = String(data.city || '')

    return { country, countryCode, city, latitude, longitude }
  } catch {
    // Geolocation is a nice-to-have for the map, not something that should
    // ever break a page load — fail quietly.
    return null
  }
}
