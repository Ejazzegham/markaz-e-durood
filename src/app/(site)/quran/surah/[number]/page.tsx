'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { FaQuran, FaCog, FaPlay, FaStop, FaSpinner, FaChevronLeft, FaChevronRight, FaExclamationTriangle } from 'react-icons/fa'
import QuranBackground, { QuranBottomOrnament } from '@/components/quran/QuranBackground'
import QuranTitleBar from '@/components/quran/QuranTitleBar'
import QuranSettingsPanel from '@/components/quran/QuranSettingsPanel'
import RevelationIcon from '@/components/quran/RevelationBadge'
import AyahCard from '@/components/quran/AyahCard'
import { fetchSurah, type SurahReading } from '@/lib/quran/api'
import { getSurahMeta, SURAHS } from '@/lib/quran/surahs'
import { useQuranSettings } from '@/contexts/QuranSettingsContext'
import { useAyahAudioPlayer } from '@/hooks/useAyahAudioPlayer'

// Surahs whose Arabic text does not open with a separate Bismillah line —
// Al-Fatihah has it baked into ayah 1 itself, and At-Taubah traditionally omits it.
const NO_STANDALONE_BISMILLAH = new Set([1, 9])

export default function SurahReadingPage() {
  const params = useParams<{ number: string }>()
  const surahNumber = Number(params.number)
  const meta = getSurahMeta(surahNumber)

  const settings = useQuranSettings()
  const [reading, setReading] = useState<SurahReading | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const { playingNumber, isLoading: audioLoading, continuous, toggle, stop, playAll } = useAyahAudioPlayer(
    reading?.ayahs ?? []
  )

  useEffect(() => {
    if (!meta) return
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchSurah(surahNumber, settings.translationEdition, settings.reciterEdition)
      .then((data) => {
        if (!cancelled) setReading(data)
      })
      .catch(() => {
        if (!cancelled) setError('Could not load this Surah right now. Please check your connection and try again.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surahNumber, settings.translationEdition, settings.reciterEdition])

  useEffect(() => {
    if (!meta) return
    settings.recordLastRead({
      type: 'surah',
      number: surahNumber,
      ayahNumberInSurah: 1,
      label: `Surah ${meta.name} — ${meta.englishMeaning}`,
    })
    return () => stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surahNumber])

  if (!meta) {
    return (
      <QuranBackground>
        <div className="text-center py-20">
          <FaExclamationTriangle className="text-gold-500 text-3xl mx-auto mb-4" />
          <p className="text-white text-lg mb-2">Surah not found</p>
          <Link href="/quran" className="text-gold-400 hover:underline text-sm">
            Back to the Qur&apos;an index
          </Link>
        </div>
      </QuranBackground>
    )
  }

  const prevSurah = SURAHS.find((s) => s.number === surahNumber - 1)
  const nextSurah = SURAHS.find((s) => s.number === surahNumber + 1)
  const showBismillah = !NO_STANDALONE_BISMILLAH.has(surahNumber)

  return (
    <QuranBackground>
      <QuranTitleBar
        backHref="/quran"
        icon={<FaQuran className="text-gold-500 text-xl" />}
        titleWhite={meta.name}
        titleGold={`(${meta.arabicName})`}
        subtitle={
          <span className="inline-flex items-center gap-1.5">
            {meta.englishMeaning} &middot;
            <RevelationIcon type={meta.revelationType} size={16} />
            {meta.revelationType} &middot; {meta.versesCount} verses
          </span>
        }
        actions={
          <>
            {reading && (
              <button
                onClick={continuous ? stop : playAll}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gold-500/10 border border-gold-500/20 hover:bg-gold-500/20 transition-colors"
              >
                {continuous ? <FaStop className="text-gold-500 text-xs" /> : <FaPlay className="text-gold-500 text-xs" />}
                <span className="text-gray-300 text-xs font-medium hidden sm:inline">
                  {continuous ? 'Stop' : 'Play Surah'}
                </span>
              </button>
            )}
            <button
              onClick={() => setSettingsOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gold-500/10 border border-gold-500/20 hover:bg-gold-500/20 transition-colors"
              aria-label="Reading settings"
            >
              <FaCog className="text-gold-500 text-xs" />
              <span className="text-gray-300 text-xs font-medium hidden sm:inline">Settings</span>
            </button>
          </>
        }
      />

      {loading && (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <FaSpinner className="animate-spin text-2xl mb-3 text-gold-500" />
          <p className="text-sm">Loading Surah {meta.name}...</p>
        </div>
      )}

      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <FaExclamationTriangle className="text-gold-500 text-2xl mb-3" />
          <p className="text-gray-300 text-sm mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null)
              setLoading(true)
              fetchSurah(surahNumber, settings.translationEdition, settings.reciterEdition)
                .then(setReading)
                .catch(() => setError('Could not load this Surah right now. Please check your connection and try again.'))
                .finally(() => setLoading(false))
            }}
            className="px-4 py-2 rounded-xl bg-gold-500 text-[#0b1d12] text-sm font-semibold hover:bg-gold-400 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && reading && (
        <>
          {showBismillah && (
            <p
              dir="rtl"
              className="text-center text-gold-400 mb-6"
              style={{ fontFamily: "'Amiri', serif", fontSize: `${Math.min(settings.arabicFontSize + 4, 44)}px` }}
            >
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
          )}

          <div>
            {reading.ayahs.map((ayah) => (
              <AyahCard
                key={ayah.number}
                ayah={ayah}
                surahNumber={surahNumber}
                surahName={meta.name}
                isPlaying={playingNumber === ayah.number}
                isLoadingAudio={audioLoading && playingNumber === ayah.number}
                onTogglePlay={() => toggle(ayah.number, ayah.audio)}
              />
            ))}
          </div>

          {/* Prev / Next surah navigation */}
          <div className="flex items-center justify-between gap-3 mt-6">
            {prevSurah ? (
              <Link
                href={`/quran/surah/${prevSurah.number}`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-850/60 border border-gold-500/15 hover:border-gold-500/40 transition-colors text-sm text-gray-300"
              >
                <FaChevronLeft className="text-xs" /> {prevSurah.name}
              </Link>
            ) : (
              <span />
            )}
            {nextSurah ? (
              <Link
                href={`/quran/surah/${nextSurah.number}`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-850/60 border border-gold-500/15 hover:border-gold-500/40 transition-colors text-sm text-gray-300"
              >
                {nextSurah.name} <FaChevronRight className="text-xs" />
              </Link>
            ) : (
              <span />
            )}
          </div>
        </>
      )}

      <QuranBottomOrnament />

      <QuranSettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </QuranBackground>
  )
}
