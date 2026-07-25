'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import {
  FaMicrophone,
  FaArrowLeft,
  FaQuran,
  FaBullhorn,
  FaSpinner,
  FaChevronRight,
  FaUserCircle,
} from 'react-icons/fa'
import type { IconType } from 'react-icons'

interface Profile {
  id: string
  name: string
  photoUrl: string
  bio?: string | null
  isFeatured?: boolean
}

type SectionKey = 'naatKhawan' | 'qari' | 'naqabat'

const SECTIONS: {
  key: SectionKey
  label: string
  profileModel: string
  detailBase: string
  icon: IconType
  tagline: string
}[] = [
  {
    key: 'naatKhawan',
    label: 'Naat Khawan',
    profileModel: 'naatKhawan',
    detailBase: '/markaz-e-naat/naat-khawan',
    icon: FaMicrophone,
    tagline: 'Reciters carrying the tradition of Naat Shareef',
  },
  {
    key: 'qari',
    label: 'Qari-e-Quran',
    profileModel: 'qari',
    detailBase: '/markaz-e-naat/qari',
    icon: FaQuran,
    tagline: 'Reciters of the Holy Quran',
  },
  {
    key: 'naqabat',
    label: 'Naqabat',
    profileModel: 'naqabat',
    detailBase: '/markaz-e-naat/naqabat',
    icon: FaBullhorn,
    tagline: 'Voices of Naqabat from our gatherings',
  },
]

export default function MarkazENaat() {
  const [activeSection, setActiveSection] = useState<SectionKey>('naatKhawan')
  const [profiles, setProfiles] = useState<Record<SectionKey, Profile[]>>({
    naatKhawan: [],
    qari: [],
    naqabat: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadAll() {
      setLoading(true)
      try {
        const results = await Promise.all(
          SECTIONS.map((s) =>
            fetch(`/api/content/${s.profileModel}`)
              .then((res) => res.json())
              .then((data) => (data.items || []) as Profile[])
              .catch(() => [] as Profile[])
          )
        )
        if (cancelled) return
        setProfiles({
          naatKhawan: results[0],
          qari: results[1],
          naqabat: results[2],
        })
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadAll()
    return () => {
      cancelled = true
    }
  }, [])

  const active = SECTIONS.find((s) => s.key === activeSection)!
  const activeProfiles = profiles[activeSection]

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-950 via-green-850 to-green-950 relative overflow-hidden">

      {/* ============================================
          PREMIUM BACKGROUND LAYERS
          ============================================ */}

      <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 80px, #D4AF37 80px, #D4AF37 81px),
            repeating-linear-gradient(90deg, transparent, transparent 80px, #D4AF37 80px, #D4AF37 81px),
            repeating-linear-gradient(45deg, transparent, transparent 160px, rgba(212, 175, 55, 0.3) 160px, rgba(212, 175, 55, 0.3) 161px),
            repeating-linear-gradient(-45deg, transparent, transparent 160px, rgba(212, 175, 55, 0.3) 160px, rgba(212, 175, 55, 0.3) 161px)
          `
        }} />
      </div>

      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold-500/3 rounded-full blur-[150px]"></div>
      </div>

      <div className="absolute top-10 left-10 w-20 h-20 border-t-2 border-l-2 border-gold-500/10 rounded-tl-2xl"></div>
      <div className="absolute top-10 right-10 w-20 h-20 border-t-2 border-r-2 border-gold-500/10 rounded-tr-2xl"></div>
      <div className="absolute bottom-10 left-10 w-20 h-20 border-b-2 border-l-2 border-gold-500/10 rounded-bl-2xl"></div>
      <div className="absolute bottom-10 right-10 w-20 h-20 border-b-2 border-r-2 border-gold-500/10 rounded-br-2xl"></div>

      {/* ============================================
          CONTENT
          ============================================ */}
      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ============================================
            PREMIUM TITLE BAR
            ============================================ */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gold-500/5 rounded-2xl blur-2xl"></div>

          <div className="relative bg-gradient-to-r from-green-850/90 via-green-900/80 to-green-850/90 backdrop-blur-xl border border-gold-500/20 rounded-2xl overflow-hidden shadow-2xl shadow-gold-500/5">

            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-6 md:px-8 py-4">

              <div className="flex items-center gap-4">
                <Link
                  href="/"
                  className="group relative p-2.5 rounded-xl bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/20 hover:border-gold-500/40 text-gold-500 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gold-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <FaArrowLeft className="relative group-hover:-translate-x-1 transition-transform text-sm" />
                </Link>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gold-500/20 rounded-xl blur-lg"></div>
                    <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-gold-500/30 to-gold-500/10 border border-gold-500/30">
                      <FaMicrophone className="text-gold-500 text-xl" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                      <span className="text-white">Markaz-e-</span>
                      <span className="text-gold-500">Naat</span>
                    </h1>
                    <p className="text-gray-400 text-xs hidden sm:block">
                      A home for the voices of Naat, Quran recitation, and Naqabat
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================
            SECTION TABS
            ============================================ */}
        <div className="flex flex-wrap gap-3 mb-8">
          {SECTIONS.map((s) => {
            const Icon = s.icon
            const isActive = s.key === activeSection
            const count = profiles[s.key].length
            return (
              <button
                key={s.key}
                onClick={() => setActiveSection(s.key)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-xl border transition-all duration-300 ${
                  isActive
                    ? 'bg-gold-500/15 border-gold-500/40 shadow-lg shadow-gold-500/5'
                    : 'bg-white/5 border-white/10 hover:border-gold-500/20 hover:bg-white/10'
                }`}
              >
                <Icon className={isActive ? 'text-gold-500' : 'text-gray-400'} />
                <span className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-gray-300'}`}>
                  {s.label}
                </span>
                {!loading && (
                  <span
                    className={`text-[11px] font-medium rounded-full px-2 py-0.5 ${
                      isActive ? 'bg-gold-500/20 text-gold-400' : 'bg-white/10 text-gray-500'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Section intro */}
        <div className="mb-6 flex items-center gap-2 text-gray-400 text-sm">
          <active.icon className="text-gold-500 text-xs" />
          <span>{active.tagline}</span>
        </div>

        {/* ============================================
            PROFILE GRID
            ============================================ */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-500 text-sm">
            <FaSpinner className="animate-spin mr-2" /> Loading profiles...
          </div>
        ) : activeProfiles.length === 0 ? (
          <div className="text-center py-20">
            <FaUserCircle className="text-gray-600 text-4xl mx-auto mb-3" />
            <p className="text-gray-400 text-sm">
              No {active.label} profiles have been added yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {activeProfiles.map((profile) => (
              <Link
                key={profile.id}
                href={`${active.detailBase}/${profile.id}`}
                className="group relative bg-gradient-to-br from-green-850/90 via-green-900/80 to-green-850/90 backdrop-blur-xl border border-gold-500/20 hover:border-gold-500/50 rounded-2xl overflow-hidden shadow-lg shadow-black/20 hover:shadow-gold-500/10 transition-all duration-300 hover:-translate-y-1"
              >
                {profile.isFeatured && (
                  <div className="absolute top-2 right-2 z-10 bg-gold-500 text-green-950 text-[9px] font-bold px-2 py-0.5 rounded-full">
                    Featured
                  </div>
                )}
                <div className="relative w-full aspect-square bg-green-900">
                  <Image
                    src={profile.photoUrl}
                    alt={profile.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-green-950/90 via-transparent to-transparent"></div>
                </div>
                <div className="p-3">
                  <p className="text-white text-sm font-semibold truncate">{profile.name}</p>
                  <div className="mt-1 flex items-center gap-1 text-gold-500 text-[11px] font-medium">
                    View all <FaChevronRight className="text-[9px] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* ============================================
            BOTTOM DECORATION
            ============================================ */}
        <div className="mt-16 flex items-center justify-center gap-4">
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-gold-500/30"></div>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-gold-500/40"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-gold-500 shadow-lg shadow-gold-500/50"></div>
            <div className="w-1 h-1 rounded-full bg-gold-500/40"></div>
          </div>
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-gold-500/30"></div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-[10px] text-gray-600 tracking-wider">
            <FaMicrophone className="inline mr-1.5 text-gold-500/30 text-[10px]" />
            Bringing the blessings of Naat to every heart
          </p>
        </div>

      </div>
    </div>
  )
}
