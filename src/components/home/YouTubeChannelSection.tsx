'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { FaYoutube, FaPlay, FaExternalLinkAlt, FaSpinner, FaClock } from 'react-icons/fa'

// ============================================================
// YOUTUBE CHANNEL SECTION — one screen: player (left) + a real,
// scrollable sidebar of the whole channel (right), same pattern as
// the Resources pages' video theater. As the sidebar is scrolled,
// it keeps fetching further pages from the channel's uploads
// playlist until the entire channel has been loaded — so unlike a
// plain YouTube iframe (which only shows a handful of "up next"
// items on a narrow screen), this always has the full history.
//
// Data comes from /api/youtube/videos, which talks to the real
// YouTube Data API server-side (see src/lib/youtube/api.ts). Needs
// YOUTUBE_API_KEY + YOUTUBE_CHANNEL_ID set in the environment — see
// .env.example.
// ============================================================

const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@SultanFiazulHassan-Qadri'

interface VideoItem {
  id: string
  title: string
  thumbnail: string
  publishedAt: string
  durationSeconds: number
  isShort: boolean
  viewCount?: string
}

function timeAgo(iso?: string) {
  if (!iso) return ''
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  const units: [number, string][] = [
    [31536000, 'year'],
    [2592000, 'month'],
    [604800, 'week'],
    [86400, 'day'],
    [3600, 'hour'],
    [60, 'minute'],
  ]
  for (const [secs, label] of units) {
    const val = Math.floor(seconds / secs)
    if (val >= 1) return `${val} ${label}${val > 1 ? 's' : ''} ago`
  }
  return 'just now'
}

function formatDuration(total: number) {
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function formatCount(count?: string) {
  if (!count) return null
  const n = Number(count)
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}

export default function YouTubeChannelSection() {
  const [notConfigured, setNotConfigured] = useState(false)

  const [videos, setVideos] = useState<VideoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [nextPageToken, setNextPageToken] = useState<string | null>(null)

  const [active, setActive] = useState<VideoItem | null>(null)
  const [autoplay, setAutoplay] = useState(false)
  const playerTopRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  // ---- initial load ----
  useEffect(() => {
    fetch('/api/youtube/videos')
      .then((res) => res.json())
      .then((data) => {
        if (data.error === 'not_configured') {
          setNotConfigured(true)
          return
        }
        setVideos(data.items || [])
        setNextPageToken(data.nextPageToken || null)
        if (data.items?.length) setActive(data.items[0])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // ---- infinite scroll: keep fetching until the whole channel is loaded ----
  const loadMore = useCallback(() => {
    if (!nextPageToken || loadingMore) return
    setLoadingMore(true)
    fetch(`/api/youtube/videos?pageToken=${nextPageToken}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) return
        setVideos((prev) => [...prev, ...(data.items || [])])
        setNextPageToken(data.nextPageToken || null)
      })
      .catch(() => {})
      .finally(() => setLoadingMore(false))
  }, [nextPageToken, loadingMore])

  useEffect(() => {
    const el = sentinelRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore()
      },
      { rootMargin: '400px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [loadMore])

  const handleSelect = (item: VideoItem) => {
    if (item.id === active?.id) return
    setActive(item)
    setAutoplay(true)
    if (window.innerWidth < 1024 && playerTopRef.current) {
      playerTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Channel not connected yet — quiet, friendly fallback instead of a
  // broken-looking empty section (visible if YOUTUBE_API_KEY isn't set).
  if (notConfigured) {
    return (
      <section
        className="py-16 sm:py-20 px-4"
        style={{ background: 'linear-gradient(to bottom, #02070d, #071018)' }}
      >
        <div className="max-w-2xl mx-auto text-center rounded-3xl border border-gold-500/20 bg-white/[0.03] p-10">
          <FaYoutube className="text-red-500/60 text-5xl mx-auto mb-4" />
          <h3 className="text-white font-semibold text-lg mb-2">YouTube channel not connected yet</h3>
          <p className="text-gray-400 text-sm mb-6">
            Add <code className="text-gold-400">YOUTUBE_API_KEY</code> and{' '}
            <code className="text-gold-400">YOUTUBE_CHANNEL_ID</code> to the environment to show the live
            channel here.
          </p>
          <a
            href={YOUTUBE_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-black px-6 py-3 rounded-lg font-semibold transition-all text-sm"
          >
            Visit Our YouTube Channel <FaExternalLinkAlt className="text-xs" />
          </a>
        </div>
      </section>
    )
  }

  return (
    <section
      id="youtube-channel"
      className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-10 overflow-hidden scroll-mt-20"
      style={{ background: 'linear-gradient(to bottom, #02070d, #071018)' }}
    >
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
              <FaYoutube className="text-red-500 text-xs" />
              <span className="text-red-400 text-xs font-medium tracking-wider">OUR CHANNEL</span>
            </div>
          </div>
          <h2 className="text-gold-500 text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Watch on YouTube
          </h2>
          <div className="flex justify-center mb-5">
            <div className="w-20 h-[2px] bg-gold-500" />
          </div>
          <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
            Every video and every Short, right here — scroll the list to browse the whole channel.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-500 text-sm">
            <FaSpinner className="animate-spin mr-2" /> Loading channel...
          </div>
        ) : !active ? (
          <p className="text-center text-gray-500 text-sm py-20">No videos found yet.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-6 items-start">
            {/* ---------------- Player (left) ---------------- */}
            <div ref={playerTopRef} className="min-w-0 scroll-mt-28">
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-gold-500/20 bg-black shadow-2xl shadow-black/40">
                <iframe
                  key={active.id}
                  src={`https://www.youtube.com/embed/${active.id}?rel=0${autoplay ? '&autoplay=1' : ''}`}
                  title={active.title}
                  className="absolute inset-0 w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="mt-4 bg-gradient-to-br from-white/[0.05] to-black/40 backdrop-blur-2xl border border-gold-500/20 rounded-xl p-5">
                <h3 className="text-white font-semibold text-lg leading-snug">{active.title}</h3>
                <div className="flex items-center gap-3 text-gray-500 text-xs mt-2">
                  <span>{timeAgo(active.publishedAt)}</span>
                  {formatCount(active.viewCount) && <span>• {formatCount(active.viewCount)} views</span>}
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2.5">
                  <a
                    href={`https://www.youtube.com/watch?v=${active.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-red-600/20 hover:bg-red-600/30 text-white font-semibold text-xs py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-red-500/30"
                  >
                    <FaYoutube className="text-red-500" />
                    Watch on YouTube
                  </a>
                  <a
                    href={YOUTUBE_CHANNEL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gold-500/10 hover:bg-gold-500/20 text-gold-500 font-semibold text-xs py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-gold-500/30"
                  >
                    Subscribe
                  </a>
                </div>
              </div>
            </div>

            {/* ---------------- Sidebar (right) — whole channel ---------------- */}
            <div className="min-w-0 lg:sticky lg:top-24">
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-sm font-bold text-white tracking-wide">All Videos & Shorts</h3>
                <span className="text-[11px] text-gold-500 font-medium">{videos.length}+ loaded</span>
              </div>

              <div
                className="scrollbar-hide space-y-2.5 overflow-y-auto pr-1 lg:max-h-[calc(100vh-9rem)]"
                style={{ maxHeight: 'min(70vh, 680px)' }}
              >
                {videos.map((item) => {
                  const isActive = item.id === active.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      className={`group w-full text-left flex gap-3 rounded-xl p-2 transition-all duration-300 border ${
                        isActive
                          ? 'bg-gold-500/10 border-gold-500/40 shadow-lg shadow-gold-500/5'
                          : 'bg-white/[0.03] border-transparent hover:bg-white/[0.06] hover:border-gold-500/20'
                      }`}
                    >
                      <div className={`relative shrink-0 rounded-lg overflow-hidden bg-black ${item.isShort ? 'w-16 aspect-[9/16]' : 'w-32 sm:w-36 aspect-video'}`}>
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="absolute inset-0 w-full h-full object-cover"
                          loading="lazy"
                        />
                        {isActive ? (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span className="bg-gold-500 text-black text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                              Playing
                            </span>
                          </div>
                        ) : (
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <div className="w-7 h-7 bg-gold-500 rounded-full flex items-center justify-center">
                              <FaPlay className="text-black text-[9px] ml-0.5" />
                            </div>
                          </div>
                        )}
                        {item.isShort && (
                          <span className="absolute top-1 left-1 bg-red-600 text-white text-[8px] font-bold px-1 py-0.5 rounded">
                            SHORT
                          </span>
                        )}
                        <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] font-medium px-1 py-0.5 rounded">
                          {formatDuration(item.durationSeconds)}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0 py-0.5">
                        <h4
                          className={`text-xs font-semibold leading-snug line-clamp-2 transition-colors ${
                            isActive ? 'text-gold-500' : 'text-white group-hover:text-gold-500'
                          }`}
                        >
                          {item.title}
                        </h4>
                        <p className="mt-1.5 text-[11px] text-gray-500 flex items-center gap-1">
                          <FaClock className="text-gold-500/60 text-[9px]" />
                          {timeAgo(item.publishedAt)}
                        </p>
                      </div>
                    </button>
                  )
                })}

                {/* Infinite-scroll sentinel — keeps loading until whole channel is in */}
                <div ref={sentinelRef} className="h-4" />
                {loadingMore && (
                  <div className="flex items-center justify-center py-4 text-gray-500 text-xs">
                    <FaSpinner className="animate-spin mr-2" /> Loading more...
                  </div>
                )}
                {!nextPageToken && videos.length > 0 && (
                  <p className="text-center text-gray-600 text-[11px] py-3">
                    That's the whole channel.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
