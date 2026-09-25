'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { FaArrowLeft } from 'react-icons/fa'

interface QuranTitleBarProps {
  backHref: string
  icon: ReactNode
  titleWhite: string
  titleGold: string
  subtitle?: string
  /** Right-aligned stat badges / action buttons */
  actions?: ReactNode
}

// Shared premium header used across every /quran page — mirrors the title
// bar used on the Resources pages (gold-accented glass panel, icon badge,
// two-tone heading) so the Qur'an section matches the rest of the site.
export default function QuranTitleBar({ backHref, icon, titleWhite, titleGold, subtitle, actions }: QuranTitleBarProps) {
  return (
    <div className="relative mb-8">
      <div className="absolute inset-0 bg-gold-500/5 rounded-2xl blur-2xl"></div>

      <div className="relative bg-gradient-to-r from-green-850/90 via-green-900/80 to-green-850/90 backdrop-blur-xl border border-gold-500/20 rounded-2xl overflow-hidden shadow-2xl shadow-gold-500/5">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-6 md:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              href={backHref}
              className="group relative p-2.5 rounded-xl bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/20 hover:border-gold-500/40 text-gold-500 transition-all duration-300 overflow-hidden flex-shrink-0"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gold-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <FaArrowLeft className="relative group-hover:-translate-x-1 transition-transform text-sm" />
            </Link>

            <div className="flex items-center gap-3 min-w-0">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-gold-500/20 rounded-xl blur-lg"></div>
                <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-gold-500/30 to-gold-500/10 border border-gold-500/30">
                  {icon}
                </div>
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight truncate">
                  <span className="text-white">{titleWhite}</span>
                  {titleGold && <span className="text-gold-500"> {titleGold}</span>}
                </h1>
                {subtitle && <p className="text-gray-400 text-xs hidden sm:block truncate">{subtitle}</p>}
              </div>
            </div>
          </div>

          {actions && <div className="flex items-center gap-3 flex-shrink-0">{actions}</div>}
        </div>
      </div>
    </div>
  )
}
