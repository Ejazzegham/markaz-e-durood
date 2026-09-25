'use client'

import Link from 'next/link'
import { FaBookmark, FaTrash, FaArrowRight } from 'react-icons/fa'
import QuranBackground, { QuranBottomOrnament } from '@/components/quran/QuranBackground'
import QuranTitleBar from '@/components/quran/QuranTitleBar'
import { useQuranSettings } from '@/contexts/QuranSettingsContext'

export default function QuranBookmarksPage() {
  const settings = useQuranSettings()

  return (
    <QuranBackground>
      <QuranTitleBar
        backHref="/quran"
        icon={<FaBookmark className="text-gold-500 text-xl" />}
        titleWhite="My"
        titleGold="Bookmarks"
        subtitle="Ayahs you've saved to revisit"
      />

      {!settings.hydrated ? (
        <p className="text-gray-400 text-sm text-center py-16">Loading your bookmarks...</p>
      ) : settings.bookmarks.length === 0 ? (
        <div className="text-center py-16">
          <FaBookmark className="text-gold-500/40 text-3xl mx-auto mb-4" />
          <p className="text-gray-300 mb-2">You haven&apos;t bookmarked any ayahs yet.</p>
          <p className="text-gray-500 text-sm mb-6">
            Tap the bookmark icon on any ayah while reading to save it here.
          </p>
          <Link
            href="/quran"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 text-[#0b1d12] text-sm font-semibold hover:bg-gold-400 transition-colors"
          >
            Browse the Qur&apos;an <FaArrowRight className="text-xs" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {settings.bookmarks.map((b) => (
            <div
              key={b.key}
              className="flex items-center gap-4 p-4 rounded-2xl bg-green-850/60 border border-gold-500/10 hover:border-gold-500/40 transition-all duration-200"
            >
              <Link href={`/quran/surah/${b.surahNumber}#ayah-${b.ayahNumberInSurah}`} className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-[15px] truncate">
                  {b.surahName} &middot; Ayah {b.ayahNumberInSurah}
                </h3>
                <p className="text-gray-500 text-xs mt-0.5">Saved {new Date(b.addedAt).toLocaleDateString()}</p>
              </Link>
              <button
                onClick={() => settings.removeBookmark(b.key)}
                className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition-colors flex-shrink-0"
                aria-label="Remove bookmark"
              >
                <FaTrash className="text-xs" />
              </button>
            </div>
          ))}
        </div>
      )}

      <QuranBottomOrnament />
    </QuranBackground>
  )
}
