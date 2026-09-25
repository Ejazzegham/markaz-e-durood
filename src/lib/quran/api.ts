// Client-side data layer for the Qur'an reader.
//
// Text, translations and per-ayah audio come from the free, unauthenticated
// Al-Quran Cloud API (https://alquran.cloud/api). Tafsir comes from the free
// spa5k/tafsir_api static JSON mirror served over the jsDelivr CDN. Both are
// public-domain / open Islamic reference data — nothing here is scraped from
// any single branded site, and no key or server secret is required, so these
// calls are made directly from the browser.

const QURAN_API_BASE = 'https://api.alquran.cloud/v1'
const TAFSIR_CDN_BASE = 'https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir'
const AUDIO_CDN_BASE = 'https://cdn.islamic.network/quran'

export interface AyahSurahRef {
  number: number
  name: string
  englishName: string
  englishNameTranslation: string
  revelationType: string
}

export interface Ayah {
  /** Global ayah number (1-6236) */
  number: number
  /** Ayah number within its surah (1-based) */
  numberInSurah: number
  /** Arabic Uthmani text */
  arabic: string
  /** Translation text in the selected language/edition */
  translation: string
  /** Audio URL for the selected reciter edition, when available */
  audio?: string
  /** Which surah this ayah belongs to — always present, most useful on Para pages that span surahs */
  surah?: AyahSurahRef
  juz?: number
  page?: number
}

export interface SurahReading {
  number: number
  name: string
  englishName: string
  englishNameTranslation: string
  revelationType: string
  ayahs: Ayah[]
}

export interface JuzReading {
  number: number
  ayahs: Ayah[]
}

async function fetchJson(url: string): Promise<any> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Request failed (${res.status})`)
  }
  const json = await res.json()
  if (json?.code && json.code !== 200) {
    throw new Error(json?.data || 'Request failed')
  }
  return json
}

function zipAyahs(
  arabicAyahs: any[],
  translationAyahs: any[],
  audioAyahs: any[] | null
): Ayah[] {
  return arabicAyahs.map((a, i) => {
    const t = translationAyahs[i]
    const au = audioAyahs ? audioAyahs[i] : undefined
    return {
      number: a.number,
      numberInSurah: a.numberInSurah,
      arabic: a.text,
      translation: t?.text ?? '',
      audio: au?.audio,
      surah: a.surah
        ? {
            number: a.surah.number,
            name: a.surah.name,
            englishName: a.surah.englishName,
            englishNameTranslation: a.surah.englishNameTranslation,
            revelationType: a.surah.revelationType,
          }
        : undefined,
      juz: a.juz,
      page: a.page,
    }
  })
}

/** Fetch one full Surah — Arabic text + a translation + per-ayah audio, in parallel. */
export async function fetchSurah(
  surahNumber: number,
  translationEdition: string,
  reciterEdition: string
): Promise<SurahReading> {
  const [arabicRes, translationRes, audioRes] = await Promise.all([
    fetchJson(`${QURAN_API_BASE}/surah/${surahNumber}/quran-uthmani`),
    fetchJson(`${QURAN_API_BASE}/surah/${surahNumber}/${translationEdition}`),
    fetchJson(`${QURAN_API_BASE}/surah/${surahNumber}/${reciterEdition}`).catch(() => null),
  ])

  const arabicData = arabicRes.data
  const ayahs = zipAyahs(arabicData.ayahs, translationRes.data.ayahs, audioRes?.data?.ayahs ?? null)

  return {
    number: arabicData.number,
    name: arabicData.name,
    englishName: arabicData.englishName,
    englishNameTranslation: arabicData.englishNameTranslation,
    revelationType: arabicData.revelationType,
    ayahs,
  }
}

/** Fetch one full Juz/Para — Arabic text + a translation + per-ayah audio, in parallel. */
export async function fetchJuz(
  juzNumber: number,
  translationEdition: string,
  reciterEdition: string
): Promise<JuzReading> {
  const [arabicRes, translationRes, audioRes] = await Promise.all([
    fetchJson(`${QURAN_API_BASE}/juz/${juzNumber}/quran-uthmani`),
    fetchJson(`${QURAN_API_BASE}/juz/${juzNumber}/${translationEdition}`),
    fetchJson(`${QURAN_API_BASE}/juz/${juzNumber}/${reciterEdition}`).catch(() => null),
  ])

  const arabicData = arabicRes.data
  const ayahs = zipAyahs(arabicData.ayahs, translationRes.data.ayahs, audioRes?.data?.ayahs ?? null)

  return { number: juzNumber, ayahs }
}

function stripHtml(input: string): string {
  return input
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Fetch the tafsir (commentary) text for one ayah from a given tafsir edition. */
export async function fetchTafsir(
  tafsirSlug: string,
  surahNumber: number,
  ayahNumberInSurah: number
): Promise<string> {
  const url = `${TAFSIR_CDN_BASE}/${tafsirSlug}/${surahNumber}/${ayahNumberInSurah}.json`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error('Tafsir is not available for this ayah')
  }
  const data = await res.json()

  let raw: unknown
  if (typeof data === 'string') raw = data
  else if (data && typeof data.text === 'string') raw = data.text
  else if (data && typeof data.tafsir === 'string') raw = data.tafsir
  else if (data && typeof data.translation === 'string') raw = data.translation

  if (typeof raw !== 'string' || !raw.trim()) {
    throw new Error('Tafsir is not available for this ayah')
  }
  return stripHtml(raw)
}

/** Build the CDN URL for a full-surah audio recitation (not per-ayah). */
export function getSurahAudioUrl(reciterEdition: string, surahNumber: number, bitrate: 64 | 128 = 128): string {
  return `${AUDIO_CDN_BASE}/audio-surah/${bitrate}/${reciterEdition}/${surahNumber}.mp3`
}
