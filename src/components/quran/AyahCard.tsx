'use client'

import { useEffect, useState } from 'react'
import { FaPlay, FaPause, FaSpinner, FaBookOpen, FaBookmark, FaRegBookmark, FaShareAlt, FaChevronDown } from 'react-icons/fa'
import type { Ayah } from '@/lib/quran/api'
import { fetchTafsir } from '@/lib/quran/api'
import { useQuranSettings } from '@/contexts/QuranSettingsContext'
import { getQuranThemeClasses } from './theme'
import { TRANSLATIONS, TAFSIRS, type QuranTheme } from '@/lib/quran/constants'

interface AyahCardProps {
  ayah: Ayah
  surahNumber: number
  surahName: string
  isPlaying: boolean
  isLoadingAudio: boolean
  onTogglePlay: () => void
}

export default function AyahCard({ ayah, surahNumber, surahName, isPlaying, isLoadingAudio, onTogglePlay }: AyahCardProps) {
  const settings = useQuranSettings()
  const t = getQuranThemeClasses(settings.theme as QuranTheme)

  const [tafsirOpen, setTafsirOpen] = useState(false)
  const [tafsirText, setTafsirText] = useState<string | null>(null)
  const [tafsirLoading, setTafsirLoading] = useState(false)
  const [tafsirError, setTafsirError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const bookmarkKey = `${surahNumber}:${ayah.numberInSurah}`
  const bookmarked = settings.isBookmarked(bookmarkKey)
  const translationMeta = TRANSLATIONS.find((tr) => tr.edition === settings.translationEdition)
  const tafsirMeta = TAFSIRS.find((tf) => tf.slug === settings.tafsirSlug)

  const handleToggleTafsir = async () => {
    const next = !tafsirOpen
    setTafsirOpen(next)
    if (next && tafsirText === null && !tafsirLoading) {
      setTafsirLoading(true)
      setTafsirError(null)
      try {
        const text = await fetchTafsir(settings.tafsirSlug, surahNumber, ayah.numberInSurah)
        setTafsirText(text)
      } catch {
        setTafsirError('Tafseer is not available for this ayah in the selected edition.')
      } finally {
        setTafsirLoading(false)
      }
    }
  }

  const handleBookmark = () => {
    if (bookmarked) {
      settings.removeBookmark(bookmarkKey)
    } else {
      settings.addBookmark({ key: bookmarkKey, surahNumber, ayahNumberInSurah: ayah.numberInSurah, surahName })
    }
  }

  const handleShare = async () => {
    const url = `${window.location.origin}/quran/surah/${surahNumber}#ayah-${ayah.numberInSurah}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard API unavailable — silently ignore
    }
  }

  // Clear any cached tafsir text when the user switches editions in settings,
  // so re-opening the panel re-fetches from the newly selected edition.
  useEffect(() => {
    setTafsirText(null)
    setTafsirError(null)
    setTafsirOpen(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.tafsirSlug])

  return (
    <div
      id={`ayah-${ayah.numberInSurah}`}
      className={`rounded-2xl p-5 md:p-6 mb-4 scroll-mt-28 transition-colors ${t.panel} ${
        isPlaying ? 'ring-2 ring-gold-500/50' : ''
      }`}
    >
      {/* Top row: ayah number + actions */}
      <div className="flex items-center justify-between mb-4">
        <div className={`flex items-center justify-center w-9 h-9 rounded-full text-xs font-bold flex-shrink-0 ${t.ayahNumberBadge}`}>
          {ayah.numberInSurah}
        </div>

        <div className="flex items-center gap-1.5">
          {ayah.audio && (
            <button
              onClick={onTogglePlay}
              className="p-2 rounded-lg bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/20 text-gold-500 transition-colors"
              aria-label={isPlaying ? 'Pause recitation' : 'Play recitation'}
            >
              {isLoadingAudio ? (
                <FaSpinner className="animate-spin text-sm" />
              ) : isPlaying ? (
                <FaPause className="text-sm" />
              ) : (
                <FaPlay className="text-sm ml-0.5" />
              )}
            </button>
          )}
          <button
            onClick={handleToggleTafsir}
            className={`p-2 rounded-lg border transition-colors ${
              tafsirOpen
                ? 'bg-gold-500 text-[#0b1d12] border-gold-500'
                : 'bg-gold-500/10 hover:bg-gold-500/20 border-gold-500/20 text-gold-500'
            }`}
            aria-label="Toggle tafseer"
          >
            <FaBookOpen className="text-sm" />
          </button>
          <button
            onClick={handleBookmark}
            className="p-2 rounded-lg bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/20 text-gold-500 transition-colors"
            aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
          >
            {bookmarked ? <FaBookmark className="text-sm" /> : <FaRegBookmark className="text-sm" />}
          </button>
          <button
            onClick={handleShare}
            className="p-2 rounded-lg bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/20 text-gold-500 transition-colors"
            aria-label="Copy link to this ayah"
          >
            <FaShareAlt className="text-sm" />
          </button>
          {copied && <span className="text-[10px] text-gold-400 ml-1">Copied!</span>}
        </div>
      </div>

      {/* Arabic */}
      <p
        dir="rtl"
        className={`text-right mb-4 ${t.arabicText}`}
        style={{
          fontFamily: "'Amiri', serif",
          fontSize: `${settings.arabicFontSize}px`,
          lineHeight: 2.1,
        }}
      >
        {ayah.arabic}
      </p>

      {/* Translation */}
      {settings.showTranslation && ayah.translation && (
        <p
          dir={translationMeta?.rtl ? 'rtl' : 'ltr'}
          className={`${translationMeta?.rtl ? 'font-urdu text-right' : 'text-left'} ${t.translationText}`}
          style={{ fontSize: `${settings.translationFontSize}px` }}
        >
          {ayah.translation}
        </p>
      )}

      {/* Tafsir panel */}
      {tafsirOpen && (
        <div className={`mt-4 rounded-xl p-4 ${t.tafsirBg}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[11px] uppercase tracking-widest font-semibold ${t.metaText}`}>
              Tafseer — {tafsirMeta?.label ?? 'Commentary'}
            </span>
            <button onClick={() => setTafsirOpen(false)} className={`${t.metaText} hover:opacity-70`}>
              <FaChevronDown className="text-xs rotate-180" />
            </button>
          </div>
          {tafsirLoading && (
            <p className={`text-sm flex items-center gap-2 ${t.tafsirText}`}>
              <FaSpinner className="animate-spin" /> Loading tafseer...
            </p>
          )}
          {tafsirError && <p className={`text-sm ${t.tafsirText}`}>{tafsirError}</p>}
          {!tafsirLoading && !tafsirError && tafsirText && (
            <p dir={tafsirMeta?.rtl ? 'rtl' : 'ltr'} className={`${tafsirMeta?.rtl ? 'font-urdu text-right' : 'text-left'} text-sm leading-relaxed ${t.tafsirText}`}>
              {tafsirText}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
