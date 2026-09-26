import { CalculationMethod, Coordinates, Madhab, PrayerTimes } from 'adhan'

export type MethodKey =
  | 'MuslimWorldLeague'
  | 'Karachi'
  | 'UmmAlQura'
  | 'Egyptian'
  | 'Dubai'
  | 'NorthAmerica'
  | 'Kuwait'
  | 'Qatar'
  | 'Singapore'
  | 'Tehran'
  | 'Turkey'
  | 'MoonsightingCommittee'

export interface MethodOption {
  key: MethodKey
  label: string
}

// A curated, friendly-labelled subset of adhan's calculation methods —
// enough to cover most of the world without overwhelming the picker.
export const METHOD_OPTIONS: MethodOption[] = [
  { key: 'Karachi', label: 'University of Karachi (South Asia)' },
  { key: 'MuslimWorldLeague', label: 'Muslim World League' },
  { key: 'UmmAlQura', label: 'Umm al-Qura (Makkah)' },
  { key: 'Egyptian', label: 'Egyptian General Authority' },
  { key: 'Dubai', label: 'Dubai (UAE)' },
  { key: 'NorthAmerica', label: 'ISNA (North America)' },
  { key: 'Kuwait', label: 'Kuwait' },
  { key: 'Qatar', label: 'Qatar' },
  { key: 'Singapore', label: 'Singapore' },
  { key: 'Turkey', label: 'Turkiye (Diyanet)' },
  { key: 'Tehran', label: 'Tehran' },
  { key: 'MoonsightingCommittee', label: 'Moonsighting Committee' },
]

export type MadhabKey = 'Hanafi' | 'Shafi'

export const PRAYER_LABELS = {
  fajr: 'Fajr',
  sunrise: 'Sunrise',
  dhuhr: 'Dhuhr',
  asr: 'Asr',
  maghrib: 'Maghrib',
  isha: 'Isha',
} as const

export type PrayerKey = keyof typeof PRAYER_LABELS

// The five daily prayers an Azan is called for (sunrise is shown for
// reference but has no Azan).
export const AZAN_PRAYERS: PrayerKey[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha']

/**
 * Reads a date's calendar year/month/day as seen in a specific IANA
 * timezone, regardless of the browser's own local timezone. Used so a
 * preset city's prayer times are computed for *that city's* today, not the
 * visitor's.
 */
export function getZonedYMD(date: Date, timeZone: string): { y: number; m: number; d: number } {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value)
  return { y: get('year'), m: get('month'), d: get('day') }
}

/** A plain local Date (midnight) built from Y/M/D — only the calendar date
 *  matters to adhan's calculation, not the time-of-day. */
export function zonedCalendarDate(date: Date, timeZone?: string): Date {
  if (!timeZone) {
    // No explicit timezone (auto-detected location) — trust the browser's
    // own local calendar date, which matches the visitor's device.
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
  }
  const { y, m, d } = getZonedYMD(date, timeZone)
  return new Date(y, m - 1, d)
}

export function buildCalculationParameters(method: MethodKey, madhab: MadhabKey) {
  const params = CalculationMethod[method]()
  params.madhab = madhab === 'Hanafi' ? Madhab.Hanafi : Madhab.Shafi
  return params
}

export interface ComputedPrayerTimes {
  today: PrayerTimes
  tomorrowFajr: Date
}

export function computePrayerTimes(
  latitude: number,
  longitude: number,
  method: MethodKey,
  madhab: MadhabKey,
  now: Date,
  timeZone?: string
): ComputedPrayerTimes {
  const coordinates = new Coordinates(latitude, longitude)
  const params = buildCalculationParameters(method, madhab)
  const today = zonedCalendarDate(now, timeZone)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const todayTimes = new PrayerTimes(coordinates, today, params)
  const tomorrowTimes = new PrayerTimes(coordinates, tomorrow, params)

  return { today: todayTimes, tomorrowFajr: tomorrowTimes.fajr }
}

export function formatClockTime(date: Date, timeZone?: string): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    ...(timeZone ? { timeZone } : {}),
  })
}

/** Live countdown label like "2h 14m" or "38m" until a target instant. */
export function formatCountdown(target: Date, now: Date): string {
  let diffMs = target.getTime() - now.getTime()
  if (diffMs < 0) diffMs = 0
  const totalMinutes = Math.floor(diffMs / 60000)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}
