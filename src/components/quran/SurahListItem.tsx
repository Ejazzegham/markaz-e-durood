import Link from 'next/link'
import type { SurahMeta } from '@/lib/quran/surahs'

export default function SurahListItem({ surah }: { surah: SurahMeta }) {
  return (
    <Link
      href={`/quran/surah/${surah.number}`}
      className="group flex items-center gap-4 p-4 rounded-2xl bg-green-850/60 border border-gold-500/10 hover:border-gold-500/40 hover:bg-green-850/90 transition-all duration-200"
    >
      <div className="relative flex-shrink-0 w-11 h-11 flex items-center justify-center">
        <svg viewBox="0 0 44 44" className="absolute inset-0 w-full h-full text-gold-500/25 group-hover:text-gold-500/50 transition-colors">
          <polygon
            points="22,1 40,11.5 40,32.5 22,43 4,32.5 4,11.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
        <span className="relative text-gold-400 text-sm font-bold">{surah.number}</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-white font-semibold text-[15px] truncate">{surah.name}</h3>
          <span className="text-gold-500/80 text-lg font-arabic flex-shrink-0" style={{ fontFamily: "'Amiri', serif" }}>
            {surah.arabicName}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-gray-400 text-xs truncate">{surah.englishMeaning}</span>
          <span className="text-gray-600 text-xs">&middot;</span>
          <span className="text-gray-500 text-xs flex-shrink-0">
            {surah.revelationType} &middot; {surah.versesCount} verses
          </span>
        </div>
      </div>
    </Link>
  )
}
