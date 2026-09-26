import Link from 'next/link'
import type { SurahMeta } from '@/lib/quran/surahs'
import RevelationIcon from './RevelationBadge'

export default function SurahListItem({ surah }: { surah: SurahMeta }) {
  return (
    <Link
      href={`/quran/surah/${surah.number}`}
      className="group relative flex items-center gap-4 p-4 sm:p-4.5 rounded-2xl bg-gradient-to-br from-green-850/80 to-green-850/40 border border-gold-500/10 hover:border-gold-500/50 shadow-sm hover:shadow-lg hover:shadow-gold-500/10 transition-all duration-300 overflow-hidden"
    >
      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.10),transparent_70%)] pointer-events-none" />

      <div className="relative flex-shrink-0 w-12 h-12 flex items-center justify-center">
        <svg viewBox="0 0 44 44" className="absolute inset-0 w-full h-full text-gold-500/25 group-hover:text-gold-500/60 transition-colors duration-300">
          <polygon
            points="22,1 40,11.5 40,32.5 22,43 4,32.5 4,11.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
        <span className="relative text-gold-400 text-sm font-bold group-hover:text-gold-300 transition-colors">{surah.number}</span>
      </div>

      <div className="relative flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-white font-semibold text-[15px] truncate group-hover:text-gold-50 transition-colors">{surah.name}</h3>
          <span className="text-gold-500/80 text-lg font-arabic flex-shrink-0" style={{ fontFamily: "'Amiri', serif" }}>
            {surah.arabicName}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-gray-400 text-xs truncate">{surah.englishMeaning}</span>
          <span className="text-gray-600 text-xs">&middot;</span>
          <span className="flex items-center gap-1.5 text-gray-400 text-xs flex-shrink-0">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-gold-500/10 border border-gold-500/20 group-hover:border-gold-500/40 group-hover:bg-gold-500/15 transition-colors overflow-hidden">
              <RevelationIcon type={surah.revelationType} size={20} />
            </span>
            <span>
              {surah.revelationType} &middot; {surah.versesCount} verses
            </span>
          </span>
        </div>
      </div>
    </Link>
  )
}
