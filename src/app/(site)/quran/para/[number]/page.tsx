'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { FaQuran, FaCog, FaPlay, FaStop, FaSpinner, FaChevronLeft, FaChevronRight, FaExclamationTriangle } from 'react-icons/fa'
import QuranBackground, { QuranBottomOrnament } from '@/components/quran/QuranBackground'
import QuranTitleBar from '@/components/quran/QuranTitleBar'
import QuranSettingsPanel from '@/components/quran/QuranSettingsPanel'
import AyahCard from '@/components/quran/AyahCard'
import { fetchJuz, type JuzReading } from '@/lib/quran/api'
import { getParaMeta, PARAS } from '@/lib/quran/paras'
import { useQuranSettings } from '@/contexts/QuranSettingsContext'
import { useAyahAudioPlayer } from '@/hooks/useAyahAudioPlayer'

const NO_STANDALONE_BISMILLAH_SURAHS = new Set([1, 9])

export default function ParaReadingPage() {
  const params = useParams<{ number: string }>()
  const juzNumber = Number(params.number)
  const meta = getParaMeta(juzNumber)

  const settings = useQuranSettings()
  const [reading, setReading] = useState<JuzReading | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const { playingNumber, isLoading: audioLoading, continuous, toggle, stop, playAll } = useAyahAudioPlayer(
    reading?.ayahs ?? []
  )

  const load = () => {
    setLoading(true)
    setError(null)
    fetchJuz(juzNumber, settings.translationEdition, settings.reciterEdition)
      .then(setReading)
      .catch(() => setError('Could not load this Para right now. Please check your connection and try again.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (!meta) return
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchJuz(juzNumber, settings.translationEdition, settings.reciterEdition)
      .then((data) => {
        if (!cancelled) setReading(data)
      })
      .catch(() => {
        if (!cancelled) setError('Could not load this Para right now. Please check your connection and try again.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [juzNumber, settings.translationEdition, settings.reciterEdition])

  useEffect(() => {
    if (!meta) return
    settings.recordLastRead({
      type: 'para',
      number: juzNumber,
      label: `Para ${juzNumber}`,
    })
    return () => stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [juzNumber])

  if (!meta) {
    return (
      <QuranBackground>
        <div className="text-center py-20">
          <FaExclamationTriangle className="text-gold-500 text-3xl mx-auto mb-4" />
          <p className="text-white text-lg mb-2">Para not found</p>
          <Link href="/quran" className="text-gold-400 hover:underline text-sm">
            Back to the Qur&apos;an index
          </Link>
        </div>
      </QuranBackground>
    )
  }

  const prevPara = PARAS.find((p) => p.number === juzNumber - 1)
  const nextPara = PARAS.find((p) => p.number === juzNumber + 1)

  let lastSurahNumber: number | null = null

  return (
    <QuranBackground>
      <QuranTitleBar
        backHref="/quran"
        icon={<FaQuran className="text-gold-500 text-xl" />}
        titleWhite={`Para ${meta.number}`}
        titleGold={meta.arabicStart}
        subtitle="Section of the Holy Qur'an"
        actions={
          <>
            {reading && (
              <button
                onClick={continuous ? stop : playAll}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gold-500/10 border border-gold-500/20 hover:bg-gold-500/20 transition-colors"
              >
                {continuous ? <FaStop className="text-gold-500 text-xs" /> : <FaPlay className="text-gold-500 text-xs" />}
                <span className="text-gray-300 text-xs font-medium hidden sm:inline">
                  {continuous ? 'Stop' : 'Play Para'}
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
          <p className="text-sm">Loading Para {juzNumber}...</p>
        </div>
      )}

      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <FaExclamationTriangle className="text-gold-500 text-2xl mb-3" />
          <p className="text-gray-300 text-sm mb-4">{error}</p>
          <button
            onClick={load}
            className="px-4 py-2 rounded-xl bg-gold-500 text-[#0b1d12] text-sm font-semibold hover:bg-gold-400 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && reading && (
        <>
          <div>
            {reading.ayahs.map((ayah) => {
              const surahNumber = ayah.surah?.number
              const isNewSurah = surahNumber !== undefined && surahNumber !== lastSurahNumber
              if (surahNumber !== undefined) lastSurahNumber = surahNumber

              const showBismillah =
                isNewSurah &&
                ayah.numberInSurah === 1 &&
                surahNumber !== undefined &&
                !NO_STANDALONE_BISMILLAH_SURAHS.has(surahNumber)

              return (
                <div key={ayah.number}>
                  {isNewSurah && ayah.surah && (
                    <Link
                      href={`/quran/surah/${ayah.surah.number}`}
                      className="block text-center mb-4 mt-6 first:mt-0"
                    >
                      <span className="inline-block px-5 py-2 rounded-full bg-gold-500/10 border border-gold-500/25 text-gold-400 text-sm font-semibold hover:bg-gold-500/20 transition-colors">
                        {ayah.surah.englishName} &middot; {ayah.surah.englishNameTranslation}
                      </span>
                    </Link>
                  )}
                  {showBismillah && (
                    <p
                      dir="rtl"
                      className="text-center text-gold-400 mb-6"
                      style={{ fontFamily: "'Amiri', serif", fontSize: `${Math.min(settings.arabicFontSize + 4, 44)}px` }}
                    >
                      بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                    </p>
                  )}
                  <AyahCard
                    ayah={ayah}
                    surahNumber={ayah.surah?.number ?? 0}
                    surahName={ayah.surah?.englishName ?? ''}
                    isPlaying={playingNumber === ayah.number}
                    isLoadingAudio={audioLoading && playingNumber === ayah.number}
                    onTogglePlay={() => toggle(ayah.number, ayah.audio)}
                  />
                </div>
              )
            })}
          </div>

          {/* Prev / Next para navigation */}
          <div className="flex items-center justify-between gap-3 mt-6">
            {prevPara ? (
              <Link
                href={`/quran/para/${prevPara.number}`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-850/60 border border-gold-500/15 hover:border-gold-500/40 transition-colors text-sm text-gray-300"
              >
                <FaChevronLeft className="text-xs" /> Para {prevPara.number}
              </Link>
            ) : (
              <span />
            )}
            {nextPara ? (
              <Link
                href={`/quran/para/${nextPara.number}`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-850/60 border border-gold-500/15 hover:border-gold-500/40 transition-colors text-sm text-gray-300"
              >
                Para {nextPara.number} <FaChevronRight className="text-xs" />
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
