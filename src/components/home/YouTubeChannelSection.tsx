'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  FaYoutube,
  FaPlay,
  FaExternalLinkAlt,
  FaThumbsUp,
  FaSpinner,
  FaCommentDots,
} from 'react-icons/fa'

// ============================================================
// YOUTUBE CHANNEL SECTION — full channel, browsable on our own site
// ============================================================
// - Top row: the channel's most recently published Shorts, newest first
//   ("NEW" badge on the latest one), so fresh content never gets buried.
// - Main area: a real embedded player for whichever video is selected,
//   with its actual YouTube comments loaded and shown right underneath —
//   so people can watch and read the conversation without ever leaving
//   the site.
// - Below that: the channel's complete upload history as an
//   infinite-scrolling grid, pulled live from the channel via the
//   YouTube Data API, a page at a time as the visitor scrolls down.
//
// Data comes from /api/youtube/*, which talks to the real YouTube Data
// API server-side (see src/lib/youtube/api.ts). Needs YOUTUBE_API_KEY +
// YOUTUBE_CHANNEL_ID set in .env — see .env.example.
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

interface CommentItem {
  id: string
  author: string
  authorImage: string
  text: string
  likeCount: number
  publishedAt: string
  replyCount: number
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

  // Shorts row
  const [shorts, setShorts] = useState<VideoItem[]>([])
  const [shortsLoading, setShortsLoading] = useState(true)

  // Full channel grid (infinite scroll)
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [videosLoading, setVideosLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [nextPageToken, setNextPageToken] = useState<string | null>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  // Selected / now-playing video
  const [active, setActive] = useState<VideoItem | null>(null)

  // Comments for the active video
  const [comments, setComments] = useState<CommentItem[]>([])
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [commentsDisabled, setCommentsDisabled] = useState(false)
  const [commentsNextToken, setCommentsNextToken] = useState<string | null>(null)

  // ---- initial load: shorts + first page of videos ----
  useEffect(() => {
    fetch('/api/youtube/shorts')
      .then((res) => res.json())
      .then((data) => {
        if (data.error === 'not_configured') {
          setNotConfigured(true)
          return
        }
        setShorts(data.items || [])
      })
      .catch(() => {})
      .finally(() => setShortsLoading(false))

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
      .finally(() => setVideosLoading(false))
  }, [])

  // If there were no regular videos yet but there are Shorts, still show
  // something in the player rather than an empty panel.
  useEffect(() => {
    if (!active && shorts.length && !videosLoading) setActive(shorts[0])
  }, [active, shorts, videosLoading])

  // ---- load comments whenever the active video changes ----
  useEffect(() => {
    if (!active) return
    setComments([])
    setCommentsDisabled(false)
    setCommentsNextToken(null)
    setCommentsLoading(true)

    fetch(`/api/youtube/comments?videoId=${active.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) return
        setComments(data.items || [])
        setCommentsNextToken(data.nextPageToken || null)
        setCommentsDisabled(!!data.commentsDisabled)
      })
      .catch(() => {})
      .finally(() => setCommentsLoading(false))
  }, [active])

  const loadMoreComments = useCallback(() => {
    if (!active || !commentsNextToken) return
    setCommentsLoading(true)
    fetch(`/api/youtube/comments?videoId=${active.id}&pageToken=${commentsNextToken}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) return
        setComments((prev) => [...prev, ...(data.items || [])])
        setCommentsNextToken(data.nextPageToken || null)
      })
      .catch(() => {})
      .finally(() => setCommentsLoading(false))
  }, [active, commentsNextToken])

  // ---- infinite scroll for the full channel grid ----
  const loadMoreVideos = useCallback(() => {
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
        if (entries[0].isIntersecting) loadMoreVideos()
      },
      { rootMargin: '400px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [loadMoreVideos])

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
            channel, Shorts and comments here.
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
            Browse every video, watch Shorts, and read what others are saying — all right here,
            without leaving the site.
          </p>
        </div>

        {/* ---------------- Shorts row (newest first) ---------------- */}
        {(shortsLoading || shorts.length > 0) && (
          <div className="mb-10">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              Recent Shorts
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {shortsLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex-shrink-0 w-[140px] aspect-[9/16] rounded-2xl bg-white/5 animate-pulse"
                    />
                  ))
                : shorts.map((short, i) => (
                    <button
                      key={short.id}
                      onClick={() => setActive(short)}
                      className={`group relative flex-shrink-0 w-[140px] aspect-[9/16] rounded-2xl overflow-hidden border transition-all ${
                        active?.id === short.id
                          ? 'border-gold-500 ring-2 ring-gold-500/40'
                          : 'border-white/10 hover:border-gold-500/40'
                      }`}
                    >
                      <img
                        src={short.thumbnail}
                        alt={short.title}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/20" />
                      {i === 0 && (
                        <span className="absolute top-2 left-2 bg-gold-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide">
                          NEW
                        </span>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <FaPlay className="text-white text-lg" />
                      </div>
                      <p className="absolute bottom-2 left-2 right-2 text-white text-[11px] font-medium leading-snug line-clamp-2 text-left">
                        {short.title}
                      </p>
                    </button>
                  ))}
            </div>
          </div>
        )}

        {/* ---------------- Player + inline comments ---------------- */}
        <div className="grid lg:grid-cols-5 gap-6 mb-14">
          <div className="lg:col-span-3">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-gold-500/20 bg-black shadow-2xl shadow-black/40">
              {active ? (
                <iframe
                  key={active.id}
                  src={`https://www.youtube.com/embed/${active.id}?rel=0`}
                  title={active.title}
                  className="absolute inset-0 w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <FaSpinner className="animate-spin text-gold-500/40 text-3xl" />
                </div>
              )}
            </div>
            {active && (
              <div className="mt-4">
                <h3 className="text-white font-semibold text-lg leading-snug">{active.title}</h3>
                <div className="flex items-center gap-3 text-gray-500 text-xs mt-1">
                  <span>{timeAgo(active.publishedAt)}</span>
                  {formatCount(active.viewCount) && <span>• {formatCount(active.viewCount)} views</span>}
                </div>
              </div>
            )}
          </div>

          {/* Comments panel — read directly on our site */}
          <div className="lg:col-span-2 flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 max-h-[520px]">
            <div className="flex items-center gap-2 mb-4 flex-shrink-0">
              <FaCommentDots className="text-gold-500" />
              <h4 className="text-white font-semibold text-sm">Comments</h4>
            </div>

            <div className="overflow-y-auto pr-1 space-y-4 flex-1 scrollbar-hide">
              {commentsLoading && comments.length === 0 && (
                <div className="flex items-center justify-center py-10 text-gray-500 text-sm">
                  <FaSpinner className="animate-spin mr-2" /> Loading comments...
                </div>
              )}

              {!commentsLoading && commentsDisabled && (
                <p className="text-gray-500 text-sm py-6 text-center">
                  Comments are turned off for this video.
                </p>
              )}

              {!commentsLoading && !commentsDisabled && comments.length === 0 && (
                <p className="text-gray-500 text-sm py-6 text-center">No comments yet.</p>
              )}

              {comments.map((c) => (
                <div key={c.id} className="flex gap-3">
                  {c.authorImage ? (
                    <img src={c.authorImage} alt={c.author} className="w-8 h-8 rounded-full flex-shrink-0" loading="lazy" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-white/10 flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-white text-xs font-medium truncate">{c.author}</p>
                      <span className="text-gray-600 text-[10px]">{timeAgo(c.publishedAt)}</span>
                    </div>
                    <p className="text-gray-300 text-xs mt-0.5 whitespace-pre-line break-words">{c.text}</p>
                    {c.likeCount > 0 && (
                      <div className="flex items-center gap-1 mt-1 text-gray-500 text-[10px]">
                        <FaThumbsUp className="text-[9px]" /> {c.likeCount}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {commentsNextToken && (
                <button
                  onClick={loadMoreComments}
                  disabled={commentsLoading}
                  className="text-gold-500 text-xs font-medium hover:text-gold-400 transition-colors"
                >
                  {commentsLoading ? 'Loading...' : 'Load more comments'}
                </button>
              )}
            </div>

            {active && (
              <a
                href={`https://www.youtube.com/watch?v=${active.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 pt-3 border-t border-white/10 flex-shrink-0 text-center text-[11px] text-gray-500 hover:text-gold-400 transition-colors"
              >
                Want to add your own comment? Reply on YouTube <FaExternalLinkAlt className="inline text-[9px] ml-1" />
              </a>
            )}
          </div>
        </div>

        {/* ---------------- Full channel grid (infinite scroll) ---------------- */}
        <div>
          <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">
            All Videos
          </h3>

          {videosLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-video rounded-xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {videos.map((video) => (
                  <button
                    key={video.id}
                    onClick={() => {
                      setActive(video)
                      window.scrollTo({ top: (document.getElementById('yt-player-anchor')?.offsetTop || 0) - 100, behavior: 'smooth' })
                    }}
                    className={`group text-left rounded-xl overflow-hidden border transition-all ${
                      active?.id === video.id
                        ? 'border-gold-500 ring-1 ring-gold-500/40'
                        : 'border-white/10 hover:border-gold-500/30'
                    }`}
                  >
                    <div className="relative aspect-video bg-black">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <span className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
                        {formatDuration(video.durationSeconds)}
                      </span>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 transition-opacity">
                        <FaPlay className="text-white text-sm" />
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-white text-xs font-medium leading-snug line-clamp-2">{video.title}</p>
                      <p className="text-gray-500 text-[10px] mt-1.5">{timeAgo(video.publishedAt)}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Infinite-scroll sentinel */}
              <div ref={sentinelRef} className="h-4" />
              {loadingMore && (
                <div className="flex items-center justify-center py-8 text-gray-500 text-sm">
                  <FaSpinner className="animate-spin mr-2" /> Loading more videos...
                </div>
              )}
              {!nextPageToken && videos.length > 0 && (
                <p className="text-center text-gray-600 text-xs mt-8">
                  You've reached the end — that's the whole channel.
                </p>
              )}
            </>
          )}
        </div>

        <div id="yt-player-anchor" className="flex justify-center mt-10">
          <a
            href={YOUTUBE_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-gold-500/30 hover:bg-gold-500/10 text-gold-400 px-6 py-3 rounded-lg font-semibold transition-all text-sm"
          >
            Subscribe on YouTube <FaExternalLinkAlt className="text-xs" />
          </a>
        </div>
      </div>
    </section>
  )
}
