'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { FaArrowLeft, FaSpinner } from 'react-icons/fa'
import type { IconType } from 'react-icons'
import YoutubeStyleTheater, { PlayableItem } from './YoutubeStyleTheater'

interface Profile {
  id: string
  name: string
  photoUrl: string
  bio?: string | null
}

interface PerformerTheaterPageProps {
  /** admin model key for the profile directory, e.g. 'naatKhawan' */
  profileModel: string
  /** admin model key for that person's performances, e.g. 'naat' */
  contentModel: string
  /** the profile's Firestore id, from the dynamic route param */
  profileId: string
  /** back link to the section on the main Markaz-e-Naat page */
  backHref: string
  /** e.g. "Naat", "Recitation", "Naqabat" — used in labels */
  kindLabel: string
  /** e.g. "Reciter", "Qari", "Naqeeb" */
  subtitleFieldLabel: string
  accentIcon: IconType
}

export default function PerformerTheaterPage({
  profileModel,
  contentModel,
  profileId,
  backHref,
  kindLabel,
  subtitleFieldLabel,
  accentIcon: AccentIcon,
}: PerformerTheaterPageProps) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [items, setItems] = useState<PlayableItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      try {
        const profileRes = await fetch(`/api/content/${profileModel}/${profileId}`)
        if (!profileRes.ok) {
          if (!cancelled) setNotFound(true)
          return
        }
        const profileData = await profileRes.json()
        const p: Profile = profileData.item
        if (cancelled) return
        setProfile(p)

        const itemsRes = await fetch(
          `/api/content/${contentModel}?person=${encodeURIComponent(p.name)}`
        )
        const itemsData = await itemsRes.json()
        if (cancelled) return
        const mapped: PlayableItem[] = (itemsData.items || []).map((n: any) => ({
          id: n.id,
          title: n.title,
          subtitle: p.name,
          description: n.description,
          duration: n.duration,
          youtubeId: n.youtubeId,
        }))
        setItems(mapped)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [profileModel, contentModel, profileId])

  if (notFound) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-950 via-green-850 to-green-950 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-white text-lg font-semibold mb-2">Profile not found</p>
          <p className="text-gray-400 text-sm mb-6">This profile may have been removed.</p>
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-green-950 font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors"
          >
            <FaArrowLeft /> Back to Markaz-e-Naat
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-950 via-green-850 to-green-950 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gold-500/5 rounded-2xl blur-2xl"></div>
          <div className="relative bg-gradient-to-r from-green-850/90 via-green-900/80 to-green-850/90 backdrop-blur-xl border border-gold-500/20 rounded-2xl overflow-hidden shadow-2xl shadow-gold-500/5">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 px-6 md:px-8 py-5">
              <Link
                href={backHref}
                className="group relative p-2.5 rounded-xl bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/20 hover:border-gold-500/40 text-gold-500 transition-all duration-300 flex-shrink-0"
              >
                <FaArrowLeft className="group-hover:-translate-x-1 transition-transform text-sm" />
              </Link>

              {loading && !profile ? (
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <FaSpinner className="animate-spin" /> Loading profile...
                </div>
              ) : profile ? (
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border-2 border-gold-500/30 shadow-lg shadow-gold-500/10 flex-shrink-0 bg-green-900">
                    <Image src={profile.photoUrl} alt={profile.name} fill className="object-cover" unoptimized />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <AccentIcon className="text-gold-500 text-sm flex-shrink-0" />
                      <span className="text-[10px] uppercase tracking-widest text-gold-500/80 font-semibold">
                        {kindLabel}
                      </span>
                    </div>
                    <h1 className="text-xl md:text-2xl font-bold text-white truncate">{profile.name}</h1>
                    {profile.bio && (
                      <p className="text-gray-400 text-xs mt-1 line-clamp-2 max-w-xl">{profile.bio}</p>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Theater */}
        <YoutubeStyleTheater
          items={items}
          loading={loading}
          emptyMessage={`No ${kindLabel.toLowerCase()} items have been added for this profile yet. Check back soon!`}
          kindLabel={kindLabel}
          subtitleFieldLabel={subtitleFieldLabel}
          accentIcon={<AccentIcon className="inline text-gold-500 text-xs" />}
        />
      </div>
    </div>
  )
}
