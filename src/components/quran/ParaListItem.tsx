import Link from 'next/link'
import type { ParaMeta } from '@/lib/quran/paras'

export default function ParaListItem({ para }: { para: ParaMeta }) {
  return (
    <Link
      href={`/quran/para/${para.number}`}
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
        <span className="relative text-gold-400 text-sm font-bold group-hover:text-gold-300 transition-colors">{para.number}</span>
      </div>

      <div className="relative flex-1 min-w-0">
        <h3 className="text-white font-semibold text-[15px] group-hover:text-gold-50 transition-colors">Para {para.number}</h3>
        <span className="text-gold-500/70 text-base" style={{ fontFamily: "'Amiri', serif" }}>
          {para.arabicStart}
        </span>
      </div>
    </Link>
  )
}
