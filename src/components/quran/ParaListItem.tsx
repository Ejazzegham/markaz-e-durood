import Link from 'next/link'
import type { ParaMeta } from '@/lib/quran/paras'

export default function ParaListItem({ para }: { para: ParaMeta }) {
  return (
    <Link
      href={`/quran/para/${para.number}`}
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
        <span className="relative text-gold-400 text-sm font-bold">{para.number}</span>
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-white font-semibold text-[15px]">Para {para.number}</h3>
        <span className="text-gold-500/70 text-base" style={{ fontFamily: "'Amiri', serif" }}>
          {para.arabicStart}
        </span>
      </div>
    </Link>
  )
}
