// Turns raw GPS coordinates from navigator.geolocation into a human
// place name ("Lahore, Pakistan") using OpenStreetMap's free, keyless
// Nominatim reverse-geocoding API. Called once, right after the browser
// grants location access — never on a timer/poll — so it stays well
// within Nominatim's light-use policy.
export async function reverseGeocode(latitude: number, longitude: number): Promise<string | null> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
      { signal: controller.signal, headers: { Accept: 'application/json' } }
    )
    clearTimeout(timeout)
    if (!res.ok) return null

    const data = await res.json()
    const addr = data?.address || {}
    const place = addr.city || addr.town || addr.village || addr.county || addr.state_district || addr.state
    const country = addr.country

    if (!place && !country) return null
    return [place, country].filter(Boolean).join(', ')
  } catch {
    // Reverse geocoding is a nice-to-have label upgrade — if it fails,
    // the caller just keeps its generic "Your Location" fallback.
    return null
  }
}
