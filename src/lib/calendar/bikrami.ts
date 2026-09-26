// Punjabi "Desi" (Bikrami/Vikrami Samvat) solar calendar — the traditional
// 12-month calendar used across Punjab for seasons, fairs and folk sayings.
//
// This uses the standard fixed civil month boundaries (the same ones the
// Nanakshahi calendar adopted from the older Bikrami solar calendar, with
// the year begining at Chet 1 = 14 March), which is the version most
// commonly published for the Punjabi calendar. A local Panchang/almanac
// may differ by a day around month boundaries since the older, unreformed
// Bikrami calendar tracks a slow astronomical drift — treat this as the
// standard civil approximation, not a religious authority.

export const PUNJABI_MONTHS = [
  { en: 'Chet', gurmukhi: 'ਚੇਤ' },
  { en: 'Vaisakh', gurmukhi: 'ਵੈਸਾਖ' },
  { en: 'Jeth', gurmukhi: 'ਜੇਠ' },
  { en: 'Harh', gurmukhi: 'ਹਾੜ' },
  { en: 'Sawan', gurmukhi: 'ਸਾਵਣ' },
  { en: 'Bhadon', gurmukhi: 'ਭਾਦੋਂ' },
  { en: 'Assu', gurmukhi: 'ਅੱਸੂ' },
  { en: 'Katak', gurmukhi: 'ਕੱਤਕ' },
  { en: 'Maghar', gurmukhi: 'ਮੱਘਰ' },
  { en: 'Poh', gurmukhi: 'ਪੋਹ' },
  { en: 'Magh', gurmukhi: 'ਮਾਘ' },
  { en: 'Phagun', gurmukhi: 'ਫੱਗਣ' },
] as const

export interface BikramiDate {
  day: number
  month: number // 1-12 (1 = Chet)
  monthName: string
  monthNameGurmukhi: string
  year: number // Bikrami Samvat (Vikrami era, ~57 years ahead of the Gregorian year)
}

function isLeapGregorian(y: number): boolean {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0
}

// Pure "days since epoch" as a date-only integer, so DST/timezone never
// shifts the day count.
function dateOnly(y: number, m: number, d: number): number {
  return Date.UTC(y, m - 1, d)
}

const DAY_MS = 24 * 60 * 60 * 1000

export function gregorianToBikrami(date: Date): BikramiDate {
  const gy = date.getFullYear()
  const gm = date.getMonth() + 1
  const gd = date.getDate()
  const today = dateOnly(gy, gm, gd)

  // The Bikrami/Desi year turns over at Chet 1, fixed to 14 March.
  const mar14ThisYear = dateOnly(gy, 3, 14)
  const cycleStartYear = today >= mar14ThisYear ? gy : gy - 1
  const cycleStart = dateOnly(cycleStartYear, 3, 14)

  const dayOfCycle = Math.round((today - cycleStart) / DAY_MS) + 1 // 1-indexed

  // Phagun (the 12th month) runs 13 Feb – 13 Mar of the following Gregorian
  // year, so its length depends on whether that February is a leap month.
  const phagunLength = isLeapGregorian(cycleStartYear + 1) ? 30 : 29
  const monthLengths = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, phagunLength]

  let remaining = dayOfCycle
  let monthIndex = 0
  for (; monthIndex < monthLengths.length - 1; monthIndex++) {
    if (remaining <= monthLengths[monthIndex]) break
    remaining -= monthLengths[monthIndex]
  }

  const month = PUNJABI_MONTHS[monthIndex]
  return {
    day: remaining,
    month: monthIndex + 1,
    monthName: month.en,
    monthNameGurmukhi: month.gurmukhi,
    year: cycleStartYear + 57,
  }
}
