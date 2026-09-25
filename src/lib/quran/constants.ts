// Fixed option lists for the Qur'an reader's settings panel — translation
// languages, reciters (audio editions) and tafsir editions. Keeping these as
// one shared source means the settings panel, the surah page and the para
// page can never drift out of sync on what's selectable.

export interface TranslationOption {
  /** AlQuran Cloud edition identifier, e.g. 'ur.jalandhry' */
  edition: string
  label: string
  language: string
  /** Right-to-left script (Urdu) needs the font-urdu class + RTL direction */
  rtl?: boolean
}

export const TRANSLATIONS: TranslationOption[] = [
  { edition: 'ur.jalandhry', label: 'Jalandhry', language: 'Urdu', rtl: true },
  { edition: 'ur.kanzuliman', label: 'Kanz-ul-Iman (Ahmed Raza Khan)', language: 'Urdu', rtl: true },
  { edition: 'en.sahih', label: 'Saheeh International', language: 'English' },
  { edition: 'en.pickthall', label: 'Pickthall', language: 'English' },
]

export interface ReciterOption {
  /** AlQuran Cloud audio edition identifier */
  edition: string
  label: string
}

export const RECITERS: ReciterOption[] = [
  { edition: 'ar.alafasy', label: 'Mishary Rashid Al-Afasy' },
  { edition: 'ar.abdulbasitmurattal', label: 'Abdul Basit (Murattal)' },
  { edition: 'ar.husary', label: 'Mahmoud Khalil Al-Husary' },
  { edition: 'ar.minshawi', label: 'Mohamed Siddiq Al-Minshawi' },
  { edition: 'ar.shaatree', label: 'Abu Bakr Ash-Shaatree' },
]

export interface TafsirOption {
  /** tafsir_api (spa5k/tafsir_api) edition slug */
  slug: string
  label: string
  language: string
  rtl?: boolean
}

export const TAFSIRS: TafsirOption[] = [
  { slug: 'ur-tafseer-ibn-e-kaseer', label: 'Ibn Kathir', language: 'Urdu', rtl: true },
  { slug: 'tafsir-bayan-ul-quran', label: 'Bayan-ul-Quran (Dr. Israr Ahmad)', language: 'Urdu', rtl: true },
  { slug: 'en-tafisr-ibn-kathir', label: 'Ibn Kathir', language: 'English' },
  { slug: 'tafsir-al-jalalayn', label: 'Al-Jalalayn', language: 'English' },
]

export type QuranTheme = 'dark' | 'sepia' | 'light'

export const THEME_OPTIONS: { value: QuranTheme; label: string }[] = [
  { value: 'dark', label: 'Dark' },
  { value: 'sepia', label: 'Sepia' },
  { value: 'light', label: 'Light' },
]

export const DEFAULT_TRANSLATION_EDITION = 'ur.jalandhry'
export const DEFAULT_RECITER_EDITION = 'ar.alafasy'
export const DEFAULT_TAFSIR_SLUG = 'ur-tafseer-ibn-e-kaseer'
export const DEFAULT_THEME: QuranTheme = 'dark'

export const MIN_ARABIC_FONT = 22
export const MAX_ARABIC_FONT = 44
export const DEFAULT_ARABIC_FONT = 30

export const MIN_TRANSLATION_FONT = 14
export const MAX_TRANSLATION_FONT = 24
export const DEFAULT_TRANSLATION_FONT = 17
