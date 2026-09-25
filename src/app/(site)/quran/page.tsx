'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { FaQuran, FaSearch, FaCog, FaBookmark, FaHistory, FaArrowRight } from 'react-icons/fa'
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

  const lastRead = settings.hydrated ? settings.lastRead : null
  const lastReadHref = lastRead
    ? lastRead.type === 'surah'
      ? `/quran/surah/${lastRead.number}`
      : `/quran/para/${lastRead.number}`
    : null

  return (
    <QuranBackground>
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
        <div className="flex bg-green-850/80 border border-gold-500/20 rounded-xl p-1 w-fit">
          <button
            onClick={() => setTab('surah')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === 'surah' ? 'bg-gold-500 text-[#0b1d12]' : 'text-gray-300 hover:text-white'
            }`}
          >
            Surah
          </button>
          <button
            onClick={() => setTab('para')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === 'para' ? 'bg-gold-500 text-[#0b1d12]' : 'text-gray-300 hover:text-white'
            }`}
          >
            Para
          </button>
        </div>

        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={tab === 'surah' ? 'Search Surah by name or number...' : 'Search Para by number...'}
            className="w-full pl-10 pr-4 py-2.5 bg-green-850/80 border border-gold-500/20 rounded-xl focus:border-gold-500 outline-none text-white text-sm transition"
          />
        </div>
      </div>

      {/* Grid */}
      {tab === 'surah' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
