'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  DEFAULT_ARABIC_FONT,
  DEFAULT_RECITER_EDITION,
  DEFAULT_TAFSIR_SLUG,
  DEFAULT_THEME,
  DEFAULT_TRANSLATION_EDITION,
  DEFAULT_TRANSLATION_FONT,
  type QuranTheme,
} from '@/lib/quran/constants'

const SETTINGS_KEY = 'markaz-quran-settings-v1'
const BOOKMARKS_KEY = 'markaz-quran-bookmarks-v1'
const LAST_READ_KEY = 'markaz-quran-last-read-v1'

export interface QuranBookmark {
  /** `${surahNumber}:${ayahNumberInSurah}` */
  key: string
  surahNumber: number
  ayahNumberInSurah: number
  surahName: string
  addedAt: number
}

export interface QuranLastRead {
  type: 'surah' | 'para'
  number: number
  ayahNumberInSurah?: number
  label: string
  timestamp: number
}

interface StoredSettings {
  theme: QuranTheme
  arabicFontSize: number
  translationFontSize: number
  translationEdition: string
  reciterEdition: string
  tafsirSlug: string
  showTranslation: boolean
}

const DEFAULT_SETTINGS: StoredSettings = {
  theme: DEFAULT_THEME,
  arabicFontSize: DEFAULT_ARABIC_FONT,
  translationFontSize: DEFAULT_TRANSLATION_FONT,
  translationEdition: DEFAULT_TRANSLATION_EDITION,
  reciterEdition: DEFAULT_RECITER_EDITION,
  tafsirSlug: DEFAULT_TAFSIR_SLUG,
  showTranslation: true,
}

interface QuranSettingsValue extends StoredSettings {
  setTheme: (t: QuranTheme) => void
  setArabicFontSize: (n: number) => void
  setTranslationFontSize: (n: number) => void
  setTranslationEdition: (e: string) => void
  setReciterEdition: (e: string) => void
  setTafsirSlug: (s: string) => void
  setShowTranslation: (b: boolean) => void

  bookmarks: QuranBookmark[]
  addBookmark: (b: Omit<QuranBookmark, 'addedAt'>) => void
  removeBookmark: (key: string) => void
  isBookmarked: (key: string) => boolean

  lastRead: QuranLastRead | null
  recordLastRead: (lr: Omit<QuranLastRead, 'timestamp'>) => void

  /** True once localStorage has been read on mount — lets pages avoid a flash of default settings */
  hydrated: boolean
}

const QuranSettingsContext = createContext<QuranSettingsValue | null>(null)

export function QuranSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<StoredSettings>(DEFAULT_SETTINGS)
  const [bookmarks, setBookmarks] = useState<QuranBookmark[]>([])
  const [lastRead, setLastReadState] = useState<QuranLastRead | null>(null)
  const [hydrated, setHydrated] = useState(false)

  // Read persisted state on mount only (client-only — avoids SSR/client markup mismatch)
  useEffect(() => {
    try {
      const rawSettings = window.localStorage.getItem(SETTINGS_KEY)
      if (rawSettings) {
        setSettings((prev) => ({ ...prev, ...JSON.parse(rawSettings) }))
      }
      const rawBookmarks = window.localStorage.getItem(BOOKMARKS_KEY)
      if (rawBookmarks) {
        setBookmarks(JSON.parse(rawBookmarks))
      }
      const rawLastRead = window.localStorage.getItem(LAST_READ_KEY)
      if (rawLastRead) {
        setLastReadState(JSON.parse(rawLastRead))
      }
    } catch {
      // Corrupt or inaccessible localStorage — fall back to defaults silently
    } finally {
      setHydrated(true)
    }
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
    } catch {
      // Ignore write failures (e.g. private-browsing storage limits)
    }
  }, [settings, hydrated])

  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks))
    } catch {
      // Ignore write failures
    }
  }, [bookmarks, hydrated])

  const update = <K extends keyof StoredSettings>(key: K, value: StoredSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const addBookmark = (b: Omit<QuranBookmark, 'addedAt'>) => {
    setBookmarks((prev) => {
      if (prev.some((x) => x.key === b.key)) return prev
      return [{ ...b, addedAt: Date.now() }, ...prev]
    })
  }

  const removeBookmark = (key: string) => {
    setBookmarks((prev) => prev.filter((b) => b.key !== key))
  }

  const isBookmarked = (key: string) => bookmarks.some((b) => b.key === key)

  const recordLastRead = (lr: Omit<QuranLastRead, 'timestamp'>) => {
    const entry: QuranLastRead = { ...lr, timestamp: Date.now() }
    setLastReadState(entry)
    try {
      window.localStorage.setItem(LAST_READ_KEY, JSON.stringify(entry))
    } catch {
      // Ignore write failures
    }
  }

  const value = useMemo<QuranSettingsValue>(
    () => ({
      ...settings,
      setTheme: (t) => update('theme', t),
      setArabicFontSize: (n) => update('arabicFontSize', n),
      setTranslationFontSize: (n) => update('translationFontSize', n),
      setTranslationEdition: (e) => update('translationEdition', e),
      setReciterEdition: (e) => update('reciterEdition', e),
      setTafsirSlug: (s) => update('tafsirSlug', s),
      setShowTranslation: (b) => update('showTranslation', b),
      bookmarks,
      addBookmark,
      removeBookmark,
      isBookmarked,
      lastRead,
      recordLastRead,
      hydrated,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [settings, bookmarks, lastRead, hydrated]
  )

  return <QuranSettingsContext.Provider value={value}>{children}</QuranSettingsContext.Provider>
}

export function useQuranSettings(): QuranSettingsValue {
  const ctx = useContext(QuranSettingsContext)
  if (!ctx) {
    throw new Error('useQuranSettings must be used within a QuranSettingsProvider')
  }
  return ctx
}
