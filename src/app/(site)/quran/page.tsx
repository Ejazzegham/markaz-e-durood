'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FaQuran, FaSearch, FaCog, FaBookmark, FaHistory, FaArrowRight, FaBookOpen, FaLayerGroup } from 'react-icons/fa'
import QuranBackground, { QuranBottomOrnament } from '@/components/quran/QuranBackground'
import QuranTitleBar from '@/components/quran/QuranTitleBar'
import QuranSettingsPanel from '@/components/quran/QuranSettingsPanel'
import SurahListItem from '@/components/quran/SurahListItem'
import ParaListItem from '@/components/quran/ParaListItem'
import { SURAHS } from '@/lib/quran/surahs'
import { PARAS } from '@/lib/quran/paras'
import { useQuranSettings } from '@/contexts/QuranSettingsContext'

type Tab = 'surah' | 'para'

export default function QuranHubPage() {
  const [tab, setTab] = useState<Tab>('surah')
  const [query, setQuery] = useState('')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const settings = useQuranSettings()

  const filteredSurahs = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return SURAHS
    return SURAHS.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.englishMeaning.toLowerCase().includes(q) ||
        String(s.number) === q
    )
  }, [query])

  const filteredParas = useMemo(() => {
    const q = query.trim()
    if (!q) return PARAS
    return PARAS.filter((p) => String(p.number) === q)
  }, [query])

  // Derived straight from the reference data, so these never drift out of
  // sync with SURAHS/PARAS above.
  const stats = useMemo(() => {
    const totalVerses = SURAHS.reduce((sum, s) => sum + s.versesCount, 0)
    const makki = SURAHS.filter((s) => s.revelationType === 'Makki').length
    return { totalVerses, makki, madani: SURAHS.length - makki }
  }, [])

  const lastRead = settings.hydrated ? settings.lastRead : null
  const lastReadHref = lastRead
    ? lastRead.type === 'surah'
      ? `/quran/surah/${lastRead.number}`
      : `/quran/para/${lastRead.number}`
    : null

  return (
    <QuranBackground>
      {/* ============================================
          HERO BANNER
          ============================================ */}
      <div className="relative mb-8 h-[220px] sm:h-[300px] lg:h-[360px] rounded-3xl overflow-hidden border border-gold-500/20 shadow-2xl shadow-black/30">
        <Image
          src="/quran/quran-hero.jpg"
          alt="The Holy Qur'an resting on a stand"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 1600px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#04140c]/95 via-[#04140c]/70 to-[#04140c]/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#04140c]/70 via-transparent to-transparent" />

        <div className="relative z-10 h-full flex items-center px-6 sm:px-10 lg:px-14">
          <div className="max-w-lg">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-400 text-[11px] font-semibold uppercase tracking-widest mb-4">
              <FaQuran className="text-[10px]" />
              Kalam-e-Ilahi
            </span>
            <h2 className="text-white text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-3">
              The Noble <span className="text-gold-500">Qur&apos;an</span>
            </h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed hidden sm:block">
              Read and listen with Urdu &amp; English Tarjuma and Tafseer — a
              light upon light for every heart that seeks guidance.
            </p>
          </div>
        </div>
      </div>

      {/* Quick stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
        {[
          { label: 'Surahs', value: SURAHS.length },
          { label: 'Para (Juz)', value: PARAS.length },
          { label: 'Total Verses', value: stats.totalVerses.toLocaleString('en-US') },
          { label: 'Makki Surahs', value: stats.makki },
          { label: 'Madani Surahs', value: stats.madani },
        ].map((stat) => (
          <div
            key={stat.label}
            className="text-center px-3 py-3.5 rounded-xl bg-gradient-to-b from-green-850/70 to-green-850/40 border border-gold-500/10 hover:border-gold-500/30 transition-colors"
          >
            <p className="text-gold-400 text-lg sm:text-2xl font-bold tabular-nums leading-tight">{stat.value}</p>
            <p className="text-gray-500 text-[10px] sm:text-[11px] uppercase tracking-wider mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <QuranTitleBar
        backHref="/"
        icon={<FaQuran className="text-gold-500 text-xl" />}
        titleWhite="Al-Qur'an"
        titleGold="Al-Kareem"
        subtitle="Read & listen with Tarjuma and Tafseer"
        actions={
          <>
            <Link
              href="/quran/bookmarks"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gold-500/10 border border-gold-500/20 hover:bg-gold-500/20 transition-colors"
            >
              <FaBookmark className="text-gold-500 text-xs" />
              <span className="text-gray-300 text-xs font-medium hidden sm:inline">
                Bookmarks {settings.hydrated && settings.bookmarks.length > 0 ? `(${settings.bookmarks.length})` : ''}
              </span>
            </Link>
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

      {/* Continue reading */}
      {lastReadHref && lastRead && (
        <Link
          href={lastReadHref}
          className="flex items-center justify-between gap-4 mb-6 p-4 rounded-2xl bg-gradient-to-r from-gold-500/15 to-transparent border border-gold-500/25 hover:border-gold-500/50 transition-colors"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-xl bg-gold-500/15 border border-gold-500/25 flex-shrink-0">
              <FaHistory className="text-gold-500 text-sm" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-widest text-gold-500/80 font-semibold">Continue Reading</p>
              <p className="text-white text-sm font-medium truncate">{lastRead.label}</p>
            </div>
          </div>
          <FaArrowRight className="text-gold-500 flex-shrink-0" />
        </Link>
      )}

      {/* Tabs + search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex bg-green-850/80 border border-gold-500/20 rounded-xl p-1 w-fit shadow-inner shadow-black/20">
          <button
            onClick={() => setTab('surah')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              tab === 'surah'
                ? 'bg-gradient-to-b from-gold-400 to-gold-600 text-[#0b1d12] shadow-md shadow-gold-500/20'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <FaBookOpen className="text-xs" />
            Surah
          </button>
          <button
            onClick={() => setTab('para')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              tab === 'para'
                ? 'bg-gradient-to-b from-gold-400 to-gold-600 text-[#0b1d12] shadow-md shadow-gold-500/20'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <FaLayerGroup className="text-xs" />
            Para
          </button>
        </div>

        <div className="relative flex-1">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={tab === 'surah' ? 'Search Surah by name or number...' : 'Search Para by number...'}
            className="w-full pl-10 pr-4 py-2.5 bg-green-850/80 border border-gold-500/20 rounded-xl focus:border-gold-500 focus:shadow-[0_0_0_3px_rgba(212,175,55,0.15)] outline-none text-white text-sm transition-all duration-200"
          />
        </div>
      </div>

      {/* Grid */}
      {tab === 'surah' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredSurahs.map((s) => (
            <SurahListItem key={s.number} surah={s} />
          ))}
          {filteredSurahs.length === 0 && (
            <p className="text-gray-400 text-sm col-span-full text-center py-10">No Surah matches your search.</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredParas.map((p) => (
            <ParaListItem key={p.number} para={p} />
          ))}
          {filteredParas.length === 0 && (
            <p className="text-gray-400 text-sm col-span-full text-center py-10">No Para matches your search.</p>
          )}
        </div>
      )}

      <QuranBottomOrnament caption="Read, listen and reflect upon the words of Allah ﷻ" />

      <QuranSettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </QuranBackground>
  )
}
