// Converts a 2-letter ISO 3166-1 country code (e.g. "PK") into its flag
// emoji ("🇵🇰") using the regional indicator symbol trick — no image
// assets or extra dependency needed.
export function countryCodeToFlag(code?: string | null): string {
  if (!code || code.length !== 2 || !/^[A-Za-z]{2}$/.test(code)) return '🌐'
  const upper = code.toUpperCase()
  const points = [...upper].map((c) => 127397 + c.charCodeAt(0))
  return String.fromCodePoint(...points)
}
