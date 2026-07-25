'use client'

import { useEffect, useRef, useState } from 'react'
import {
  FaPlay,
  FaSpinner,
  FaYoutube,
  FaClock,
  FaUser,
  FaShareAlt,
  FaCheck,
} from 'react-icons/fa'

export interface PlayableItem {
  id: string
  title: string
  /** Reciter / speaker / category — shown as the small line under the title */
  subtitle?: string | null
  description?: string | null
  duration?: string | null
  youtubeId: string
  /** Optional custom thumbnail; falls back to the YouTube thumbnail */
  thumbnailUrl?: string | null
}

interface YoutubeStyleTheaterProps {
  items: PlayableItem[]
  loading: boolean
  emptyMessage: string
  /** e.g. "Naat", "Bayan", "Video", "Audio" — used in labels */
  kindLabel: string
  /** e.g. "Reciter", "Speaker" — label shown before the subtitle on the main player */
  subtitleFieldLabel?: string
  accentIcon?: React.ReactNode
}

function thumbFor(item: PlayableItem) {
  return item.thumbnailUrl || `https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`
}

export default function YoutubeStyleTheater({
  items,
  loading,
  emptyMessage,
  kindLabel,
  subtitleFieldLabel = 'By',
  accentIcon,
}: YoutubeStyleTheaterProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [autoplay, setAutoplay] = useState(false)
  const [copied, setCopied] = useState(false)
  const playerTopRef = useRef<HTMLDivElement>(null)

  // Pick the first item as active once data arrives
  useEffect(() => {
    if (!activeId && items.length > 0) {
      setActiveId(items[0].id)
    }
  }, [items, activeId])

  const active = items.find((i) => i.id === activeId) || items[0]

  const handleSelect = (item: PlayableItem) => {
    if (item.id === activeId) return
    setActiveId(item.id)
    setAutoplay(true)
    setCopied(false)
    // On mobile the sidebar sits below the player — bring the player
    // back into view so switching a track feels instant, like YouTube.
    if (window.innerWidth < 1024 && playerTopRef.current) {
      playerTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleShare = () => {
    if (!active) return
    const link = `https://www.youtube.com/watch?v=${active.youtubeId}`
    navigator.clipboard?.writeText(link).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500 text-sm">
        <FaSpinner className="animate-spin mr-2" /> Loading {kindLabel.toLowerCase()}...
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-sm">{emptyMessage}</p>
      </div>
    )
  }

  if (!active) return null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] xl:lg:grid-cols-[minmax(0,1fr)_400px] gap-6 items-start">
      {/* ============================================
          MAIN SCREEN (LEFT)
          ============================================ */}
      <div ref={playerTopRef} className="min-w-0 scroll-mt-28">
        <div className="relative rounded-2xl overflow-hidden border border-gold-500/20 shadow-2xl shadow-black/40 bg-black aspect-video">
          <iframe
            key={active.id}
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${active.youtubeId}?rel=0${autoplay ? '&autoplay=1' : ''}`}
            title={active.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>

        {/* Now playing info */}
        <div className="mt-4 bg-gradient-to-br from-green-825/90 via-green-900/80 to-green-850/90 backdrop-blur-2xl border border-gold-500/20 rounded-xl p-5">
          <h2 className="text-lg md:text-xl font-bold text-white leading-snug">{active.title}</h2>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-400">
            {active.subtitle && (
              <span className="flex items-center gap-1.5">
                <FaUser className="text-gold-500 text-[10px]" />
                {subtitleFieldLabel}: <span className="text-gray-300">{active.subtitle}</span>
              </span>
            )}
            {active.duration && (
              <span className="flex items-center gap-1.5">
                <FaClock className="text-gold-500 text-[10px]" />
                {active.duration}
              </span>
            )}
          </div>

          {active.description && (
            <p className="mt-3 text-sm text-gray-400 leading-relaxed">{active.description}</p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2.5">
            <a
              href={`https://www.youtube.com/watch?v=${active.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-red-600/20 hover:bg-red-600/30 text-white font-semibold text-xs py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-red-500/30"
            >
              <FaYoutube className="text-red-500" />
              Watch on YouTube
            </a>
            <button
              onClick={handleShare}
              className="bg-gold-500/10 hover:bg-gold-500/20 text-gold-500 font-semibold text-xs py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-gold-500/30"
            >
              {copied ? <FaCheck /> : <FaShareAlt />}
              {copied ? 'Link Copied' : 'Share'}
            </button>
          </div>
        </div>
      </div>

      {/* ============================================
          UP NEXT LIST (RIGHT) — scrollable, scrollbar hidden
          ============================================ */}
      <div className="min-w-0 lg:sticky lg:top-24">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-sm font-bold text-white tracking-wide">
            {accentIcon}
            <span className="ml-1.5">All {kindLabel}</span>
          </h3>
          <span className="text-[11px] text-gold-500 font-medium">{items.length} items</span>
        </div>

        <div
          className="scrollbar-hide space-y-2.5 overflow-y-auto pr-1 lg:max-h-[calc(100vh-9rem)]"
          style={{ maxHeight: 'min(70vh, 640px)' }}
        >
          {items.map((item) => {
            const isActive = item.id === active.id
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item)}
                className={`group w-full text-left flex gap-3 rounded-xl p-2 transition-all duration-300 border ${
                  isActive
                    ? 'bg-gold-500/10 border-gold-500/40 shadow-lg shadow-gold-500/5'
                    : 'bg-green-900/30 border-transparent hover:bg-green-900/60 hover:border-gold-500/20'
                }`}
              >
                <div className="relative w-32 sm:w-36 shrink-0 aspect-video rounded-lg overflow-hidden bg-green-950">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumbFor(item)}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {isActive ? (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="flex items-center gap-1.5 bg-gold-500 text-green-950 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        <span className="flex gap-0.5 items-end h-2.5">
                          <span className="w-0.5 h-1.5 bg-green-950 animate-[wave_0.8s_ease-in-out_infinite]" />
                          <span className="w-0.5 h-2.5 bg-green-950 animate-[wave_0.6s_ease-in-out_infinite_0.2s]" />
                          <span className="w-0.5 h-2 bg-green-950 animate-[wave_0.7s_ease-in-out_infinite_0.4s]" />
                        </span>
                        Playing
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <div className="w-8 h-8 bg-gold-500 rounded-full flex items-center justify-center">
                        <FaPlay className="text-green-950 text-[10px] ml-0.5" />
                      </div>
                    </div>
                  )}
                  {item.duration && (
                    <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] font-medium px-1.5 py-0.5 rounded">
                      {item.duration}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0 py-0.5">
                  <h4
                    className={`text-xs font-semibold leading-snug line-clamp-2 transition-colors ${
                      isActive ? 'text-gold-500' : 'text-white group-hover:text-gold-500'
                    }`}
                  >
                    {item.title}
                  </h4>
                  {item.subtitle && (
                    <p className="mt-1 text-[11px] text-gray-500 flex items-center gap-1 line-clamp-1">
                      <FaUser className="text-gold-500/70 text-[9px] shrink-0" />
                      {item.subtitle}
                    </p>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes wave {
          0%,
          100% {
            transform: scaleY(0.5);
          }
          50% {
            transform: scaleY(1);
          }
        }
      `}</style>
    </div>
  )
}
