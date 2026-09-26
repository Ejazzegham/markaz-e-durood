import umalqura from '@umalqura/core'

// Hijri month names (English + Arabic), in calendar order (1-indexed to
// match the `hm` value returned by @umalqura/core).
export const HIJRI_MONTHS = [
  { en: 'Muharram', ar: 'محرّم' },
  { en: 'Safar', ar: 'صفر' },
  { en: "Rabi' al-Awwal", ar: 'ربيع الأول' },
  { en: "Rabi' al-Thani", ar: 'ربيع الآخر' },
  { en: 'Jumada al-Awwal', ar: 'جمادى الأولى' },
  { en: 'Jumada al-Thani', ar: 'جمادى الآخرة' },
  { en: 'Rajab', ar: 'رجب' },
  { en: "Sha'ban", ar: 'شعبان' },
  { en: 'Ramadan', ar: 'رمضان' },
  { en: 'Shawwal', ar: 'شوّال' },
  { en: "Dhu al-Qi'dah", ar: 'ذو القعدة' },
  { en: 'Dhu al-Hijjah', ar: 'ذو الحجة' },
] as const

export interface HijriDate {
  day: number
  month: number // 1-12
  monthName: string
  monthNameArabic: string
  year: number
}

/**
 * Converts a Gregorian JS Date to its Hijri (Islamic) equivalent using the
 * Umm al-Qura tables (the calendar used officially in Saudi Arabia and the
 * one most Islamic calendar apps calibrate against). This is date-based —
 * the actual start of a Hijri month is still subject to local moon-sighting
 * announcements, so a mosque near you may observe a date one day earlier or
 * later.
 */
export function gregorianToHijri(date: Date): HijriDate {
  const result = umalqura(date)
  const month = HIJRI_MONTHS[result.hm - 1]
  return {
    day: result.hd,
    month: result.hm,
    monthName: month.en,
    monthNameArabic: month.ar,
    year: result.hy,
  }
}
