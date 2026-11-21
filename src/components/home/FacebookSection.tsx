'use client'

import { useEffect, useRef, useState } from 'react'
import {
  FaFacebook,
  FaFacebookF,
  FaThumbsUp,
  FaComment,
  FaExternalLinkAlt,
  FaBell,
  FaCalendarAlt,
  FaImages,
  FaVideo,
  FaArrowRight,
} from 'react-icons/fa'

// ============================================================
// FACEBOOK PAGE SECTION — premium layout
// ============================================================
// Two modes, chosen automatically:
//
//  1. Live posts via the Graph API (when FACEBOOK_PAGE_ID and
//     FACEBOOK_PAGE_ACCESS_TOKEN are configured) — rendered as
//     fully custom, full-width cards.
//
//  2. Fallback (default) — a polished split layout: a branded
//     panel on the left and a framed live Facebook widget on the
//     right. The widget is only loaded when it scrolls into view,
//     and if Facebook is blocked (ad-blocker, in-app browser) the
//     frame shows a clean "Open on Facebook" card instead of an
//     empty or broken box.
//
// Page: https://www.facebook.com/sultanfiazulhassan
// ============================================================

const FACEBOOK_PAGE_URL = 'https://www.facebook.com/sultanfiazulhassan'
const FACEBOOK_PAGE_NAME = 'Sultan Fiaz ul Hassan Qadri'
const FB_WIDGET_HEIGHT = 540

interface FacebookPost {
  id: string
  message: string
  permalinkUrl: string
  createdTime: string
  image: string | null
  likeCount: number
  commentCount: number
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

function formatCount(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}

declare global {
  interface Window {
    FB?: { XFBML: { parse: (el?: HTMLElement) => void } }
  }
}

// ------------------------------------------------------------
// Shared small pieces
// ------------------------------------------------------------

function PageIdentity() {
  return (
    <div className="flex items-center gap-3.5 min-w-0">
      <div className="relative shrink-0">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full p-[2px] bg-gradient-to-br from-gold-300 via-gold-500 to-gold-700">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Markaz-e-Durood"
            className="w-full h-full rounded-full object-cover bg-ink-900"
          />
        </div>
        <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#1877F2] border-2 border-[#0b141d] flex items-center justify-center">
          <FaFacebookF className="text-white text-[9px]" />
        </span>
      </div>
      <div className="min-w-0">
        <p className="text-white font-semibold text-sm sm:text-base leading-tight truncate">
          {FACEBOOK_PAGE_NAME}
        </p>
        <p className="text-gray-400 text-xs mt-0.5">Official Facebook Page</p>
      </div>
    </div>
  )
}

function FollowButton({ className = '' }: { className?: string }) {
  return (
    <a
      href={FACEBOOK_PAGE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-b from-[#2b86ff] to-[#1565e0] hover:from-[#4396ff] hover:to-[#1b6ff0] text-white font-semibold text-sm px-6 py-3.5 shadow-[0_10px_30px_-8px_rgba(24,119,242,0.6)] ring-1 ring-white/10 transition-all hover:-translate-y-0.5 ${className}`}
    >
      <FaFacebook className="text-lg" />
      Follow Our Page
    </a>
  )
}

const FEATURES = [
  {
    icon: FaBell,
    title: 'Daily Reminders',
    text: 'Durood Shareef reminders to start your day.',
  },
  {
    icon: FaCalendarAlt,
    title: 'Mehfil Updates',
    text: 'Announcements before programs begin.',
  },
  {
    icon: FaImages,
    title: 'Photos & Clips',
    text: 'Moments from our gatherings and events.',
  },
  {
    icon: FaVideo,
    title: 'Live Broadcasts',
    text: 'Sermons and Durood ceremonies as they happen.',
  },
]

// ------------------------------------------------------------
// Live Facebook widget inside a premium frame
// ------------------------------------------------------------

function LiveWidgetFrame({ onRetry }: { onRetry: () => void }) {
  const frameRef = useRef<HTMLDivElement>(null)
  const pageRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'failed'>('loading')

  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return

    let poll: number | undefined
    let giveUp: number | undefined
    let started = false

    const startLoading = () => {
      if (started) return
      started = true

      if (!document.getElementById('fb-root')) {
        const root = document.createElement('div')
        root.id = 'fb-root'
        document.body.prepend(root)
      }

      if (window.FB) {
        window.FB.XFBML.parse(pageRef.current ?? undefined)
      } else if (!document.getElementById('facebook-jssdk')) {
        const script = document.createElement('script')
        script.id = 'facebook-jssdk'
        script.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v19.0'
        script.async = true
        script.defer = true
        script.crossOrigin = 'anonymous'
        document.body.appendChild(script)
      }

      // Facebook injects an <iframe> once the widget is rendered.
      poll = window.setInterval(() => {
        if (pageRef.current?.querySelector('iframe')) {
          setStatus('ready')
          window.clearInterval(poll)
          window.clearTimeout(giveUp)
        }
      }, 400)

      // Blocked by an ad-blocker / in-app browser? Show a clean fallback.
      giveUp = window.setTimeout(() => {
        window.clearInterval(poll)
        setStatus((s) => (s === 'ready' ? s : 'failed'))
      }, 10000)
    }

    // Only load Facebook's script when the section is near the viewport.
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          observer.disconnect()
          startLoading()
        }
      },
      { rootMargin: '300px' }
    )
    observer.observe(frame)

    return () => {
      observer.disconnect()
      window.clearInterval(poll)
      window.clearTimeout(giveUp)
    }
  }, [])

  return (
    <div className="relative rounded-[28px] border border-gold-500/25 bg-gradient-to-b from-[#0f1c28] to-[#0a121b] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.85)] overflow-hidden">
      <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-gold-400/80 to-transparent" />

      {/* Profile header */}
      <div className="flex items-center justify-between gap-3 px-5 sm:px-6 py-4 border-b border-white/10">
        <PageIdentity />
        <a
          href={FACEBOOK_PAGE_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open our Facebook page"
          className="hidden sm:flex shrink-0 w-9 h-9 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/10 text-gray-300 hover:text-white items-center justify-center transition-colors"
        >
          <FaExternalLinkAlt className="text-xs" />
        </a>
      </div>

      {/* Widget area */}
      <div className="p-3 sm:p-4">
        <div
          ref={frameRef}
          className="relative rounded-2xl overflow-hidden bg-white flex justify-center"
          style={{ height: FB_WIDGET_HEIGHT }}
        >
          {status !== 'ready' && (
            <div className="absolute inset-0 z-10 bg-[#0d1822] flex flex-col items-center justify-center text-center px-6">
              {status === 'loading' ? (
                <>
                  <div className="w-12 h-12 rounded-full border-2 border-gold-500/20 border-t-gold-500 animate-spin mb-4" />
                  <p className="text-gray-300 text-sm font-medium">Loading latest posts…</p>
                  <div className="w-full max-w-xs mt-6 space-y-3 animate-pulse">
                    <div className="h-3 rounded bg-white/[0.07]" />
                    <div className="h-3 rounded bg-white/[0.07] w-5/6" />
                    <div className="h-3 rounded bg-white/[0.07] w-2/3" />
                  </div>
                </>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-[#1877F2]/10 border border-[#1877F2]/25 flex items-center justify-center mb-4">
                    <FaFacebook className="text-[#1877F2] text-2xl" />
                  </div>
                  <p className="text-white font-semibold mb-1.5">See our latest posts</p>
                  <p className="text-gray-400 text-xs leading-relaxed max-w-[260px] mb-5">
                    The live feed couldn&apos;t load here. This can happen with ad blockers or
                    in-app browsers. You can view everything directly on Facebook.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <FollowButton />
                    <button
                      type="button"
                      onClick={onRetry}
                      className="inline-flex items-center justify-center rounded-xl border border-white/15 hover:border-gold-500/40 bg-white/[0.03] text-gray-200 text-sm font-medium px-5 py-3.5 transition-all"
                    >
                      Try again
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          <div
            ref={pageRef}
            className="fb-page"
            data-href={FACEBOOK_PAGE_URL}
            data-tabs="timeline"
            data-width="500"
            data-height={FB_WIDGET_HEIGHT}
            data-small-header="true"
            data-adapt-container-width="true"
            data-hide-cover="true"
            data-show-facepile="false"
          >
            <blockquote cite={FACEBOOK_PAGE_URL} className="fb-xfbml-parse-ignore">
              <a href={FACEBOOK_PAGE_URL} target="_blank" rel="noopener noreferrer">
                {FACEBOOK_PAGE_NAME}
              </a>
            </blockquote>
          </div>
        </div>
      </div>

      {/* Footer link */}
      <a
        href={FACEBOOK_PAGE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-between gap-3 px-5 sm:px-6 py-4 border-t border-white/10 text-sm text-gray-300 hover:text-white hover:bg-white/[0.03] transition-colors"
      >
        <span>View all posts on Facebook</span>
        <FaArrowRight className="text-xs text-gold-500 transition-transform group-hover:translate-x-1" />
      </a>
    </div>
  )
}

function FallbackLayout() {
  const [attempt, setAttempt] = useState(0)
  return (
    <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-center">
      {/* ---------------- Branded panel ---------------- */}
      <div className="text-center lg:text-left">
        <div className="inline-flex items-center gap-2 mb-5 text-gold-500 text-[11px] font-semibold tracking-[0.25em] uppercase">
          <span className="w-8 h-px bg-gold-500/60" />
          Official Community
        </div>

        <h3 className="text-white text-3xl sm:text-4xl font-bold leading-tight mb-5">
          Join our community
          <br className="hidden sm:block" /> on <span className="text-[#4c9bff]">Facebook</span>
        </h3>

        <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
          Follow our page for daily Durood Shareef reminders, mehfil announcements and the
          teachings of {FACEBOOK_PAGE_NAME}. It is often the fastest way to hear about a
          program before it begins.
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="group flex items-start gap-3.5 rounded-2xl border border-white/10 bg-white/[0.03] hover:border-gold-500/30 hover:bg-white/[0.05] p-4 transition-all"
            >
              <div className="shrink-0 w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center">
                <Icon className="text-gold-500 text-sm" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold leading-tight">{title}</p>
                <p className="text-gray-400 text-xs mt-1 leading-relaxed">{text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
          <FollowButton className="w-full sm:w-auto" />
          <a
            href={FACEBOOK_PAGE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto rounded-xl border border-white/15 hover:border-gold-500/40 bg-white/[0.03] hover:bg-white/[0.06] text-gray-200 text-sm font-medium px-6 py-3.5 transition-all"
          >
            Visit page
            <FaExternalLinkAlt className="text-[10px] text-gold-500" />
          </a>
        </div>
      </div>

      {/* ---------------- Framed live widget ---------------- */}
      <div className="w-full max-w-[560px] mx-auto lg:max-w-none">
        <LiveWidgetFrame key={attempt} onRetry={() => setAttempt((n) => n + 1)} />
      </div>
    </div>
  )
}

// ------------------------------------------------------------
// Live Graph API posts (when configured)
// ------------------------------------------------------------

function PostsLayout({ posts }: { posts: FacebookPost[] }) {
  return (
    <div className="relative rounded-[28px] border border-gold-500/25 bg-gradient-to-b from-[#0f1c28] to-[#0a121b] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.85)] overflow-hidden">
      <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-gold-400/80 to-transparent" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 sm:px-8 py-5 border-b border-white/10">
        <PageIdentity />
        <FollowButton className="w-full sm:w-auto" />
      </div>

      <div className="p-4 sm:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {posts.map((post) => (
          <a
            key={post.id}
            href={post.permalinkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] hover:border-gold-500/35 hover:bg-white/[0.05] hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)] transition-all duration-300"
          >
            {post.image && (
              <div className="relative w-full aspect-video overflow-hidden bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            )}

            <div className="flex-1 flex flex-col p-5">
              {post.message && (
                <p className="text-gray-300 text-sm leading-relaxed line-clamp-4 flex-1">
                  {post.message}
                </p>
              )}

              <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-500">
                <span>{timeAgo(post.createdTime)}</span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5">
                    <FaThumbsUp className="text-[#4c9bff]" /> {formatCount(post.likeCount)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FaComment className="text-gold-500" /> {formatCount(post.commentCount)}
                  </span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      <a
        href={FACEBOOK_PAGE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-center gap-2 px-6 py-4 border-t border-white/10 text-sm text-gray-300 hover:text-white hover:bg-white/[0.03] transition-colors"
      >
        View all posts on Facebook
        <FaArrowRight className="text-xs text-gold-500 transition-transform group-hover:translate-x-1" />
      </a>
    </div>
  )
}

// ------------------------------------------------------------
// Section
// ------------------------------------------------------------

export default function FacebookSection() {
  const [posts, setPosts] = useState<FacebookPost[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Never leave the section stuck on its loading skeleton: give up on the
    // Graph API request after 6 seconds and show the widget layout instead.
    const controller = new AbortController()
    const timer = window.setTimeout(() => controller.abort(), 6000)
    fetch('/api/facebook/posts', { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        if (data.error || !data.posts?.length) {
          setPosts(null)
        } else {
          setPosts(data.posts)
        }
      })
      .catch(() => setPosts(null))
      .finally(() => {
        window.clearTimeout(timer)
        setLoading(false)
      })
    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [])

  return (
    <section
      className="relative py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-10 overflow-hidden"
      style={{ background: 'linear-gradient(to bottom, #071018, #02070d)' }}
    >
      {/* Ambient glows */}
      <div className="absolute top-[-15%] left-[-10%] w-[520px] h-[520px] bg-[#1877F2]/[0.06] rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[520px] h-[520px] bg-gold-500/[0.06] rounded-full blur-[130px] pointer-events-none" />

      <div className="relative z-10 max-w-[1280px] mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1877F2]/10 border border-[#1877F2]/25">
              <FaFacebook className="text-[#4c9bff] text-xs" />
              <span className="text-[#4c9bff] text-xs font-medium tracking-wider">FOLLOW US</span>
            </div>
          </div>

          <h2 className="text-gold-500 text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Our Facebook Page
          </h2>
          <div className="flex justify-center mb-5">
            <div className="w-20 h-[2px] bg-gold-500" />
          </div>
          <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
            Stay connected with our latest pictures, videos and updates.
          </p>
        </div>

        {loading ? (
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-center">
            <div className="space-y-4 animate-pulse">
              <div className="h-4 w-40 rounded bg-white/[0.06]" />
              <div className="h-12 w-3/4 rounded bg-white/[0.06]" />
              <div className="h-4 w-full rounded bg-white/[0.05]" />
              <div className="h-4 w-5/6 rounded bg-white/[0.05]" />
            </div>
            <div
              className="rounded-[28px] border border-gold-500/15 bg-white/[0.03] animate-pulse"
              style={{ height: FB_WIDGET_HEIGHT }}
            />
          </div>
        ) : posts ? (
          <PostsLayout posts={posts} />
        ) : (
          <FallbackLayout />
        )}
      </div>
    </section>
  )
}
