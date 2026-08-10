'use client'

import { useEffect, useRef, useState } from 'react'
import { FaFacebook, FaThumbsUp, FaComment, FaExternalLinkAlt } from 'react-icons/fa'

// ============================================================
// FACEBOOK PAGE SECTION — full-width, real posts via Graph API
// ============================================================
// Pulls actual posts from the Page using the Facebook Graph API and
// renders them as fully custom cards — the only way to get a
// genuinely wide Facebook feed, since Facebook's free "Page Plugin"
// widget is hard-capped at 500px by Facebook itself (a documented
// platform limit, not something adjustable from here).
//
// Needs FACEBOOK_PAGE_ID + FACEBOOK_PAGE_ACCESS_TOKEN set in the
// environment (see .env.example for how to get a token that doesn't
// expire). Until that's configured — or if the request ever fails —
// this automatically falls back to Facebook's official centered
// widget instead of showing a broken section.
//
// Page: https://www.facebook.com/sultanfiazulhassan
// ============================================================

const FACEBOOK_PAGE_URL = 'https://www.facebook.com/sultanfiazulhassan'
const FB_HEIGHT = 800 // used only by the fallback widget

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

function FallbackWidget() {
  const pageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!document.getElementById('fb-root')) {
      const root = document.createElement('div')
      root.id = 'fb-root'
      document.body.prepend(root)
    }
    if (window.FB) {
      window.FB.XFBML.parse(pageRef.current ?? undefined)
      return
    }
    if (document.getElementById('facebook-jssdk')) return
    const script = document.createElement('script')
    script.id = 'facebook-jssdk'
    script.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v19.0'
    script.async = true
    script.defer = true
    script.crossOrigin = 'anonymous'
    document.body.appendChild(script)
  }, [])

  return (
    <div className="relative w-full max-w-[560px] mx-auto rounded-3xl border border-gold-500/20 bg-gradient-to-b from-white/[0.05] to-black/40 backdrop-blur-xl p-3 sm:p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)]">
      <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-gold-400/70 to-transparent" />
      <div className="w-full flex justify-center overflow-hidden rounded-2xl" style={{ minHeight: FB_HEIGHT }}>
        <div
          ref={pageRef}
          className="fb-page w-full"
          data-href={FACEBOOK_PAGE_URL}
          data-tabs="timeline"
          data-width=""
          data-height={FB_HEIGHT}
          data-small-header="false"
          data-adapt-container-width="true"
          data-hide-cover="false"
          data-show-facepile="true"
        >
          <blockquote cite={FACEBOOK_PAGE_URL} className="fb-xfbml-parse-ignore">
            <a href={FACEBOOK_PAGE_URL} target="_blank" rel="noopener noreferrer">
              Sultan Fiaz ul Hassan Qadri
            </a>
          </blockquote>
        </div>
      </div>
    </div>
  )
}

export default function FacebookSection() {
  const [posts, setPosts] = useState<FacebookPost[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/facebook/posts')
      .then((res) => res.json())
      .then((data) => {
        if (data.error || !data.posts?.length) {
          setPosts(null)
        } else {
          setPosts(data.posts)
        }
      })
      .catch(() => setPosts(null))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section
      className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-10 overflow-hidden"
      style={{ background: 'linear-gradient(to bottom, #071018, #02070d)' }}
    >
      {/* Decorative glows to match the site's premium look */}
      <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
              <FaFacebook className="text-blue-500 text-xs" />
              <span className="text-blue-400 text-xs font-medium tracking-wider">FOLLOW US</span>
            </div>
          </div>

          <h2 className="text-gold-500 text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Our Facebook Page
          </h2>
          <div className="flex justify-center mb-5">
            <div className="w-20 h-[2px] bg-gold-500"></div>
          </div>
          <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
            Stay connected with our latest pictures, videos and updates from Facebook.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-gold-500/10 bg-white/[0.03] animate-pulse h-80" />
            ))}
          </div>
        ) : posts ? (
          <>
            {/* Real posts, pulled live via the Graph API — full width */}
            <div className="relative rounded-3xl border border-gold-500/20 bg-gradient-to-b from-white/[0.04] to-black/30 backdrop-blur-xl p-4 sm:p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)]">
              <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-gold-400/70 to-transparent" />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <a
                    key={post.id}
                    href={post.permalinkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] hover:border-gold-500/30 hover:bg-white/[0.05] transition-all"
                  >
                    {post.image && (
                      <div className="relative w-full aspect-video overflow-hidden bg-black">
                        <img
                          src={post.image}
                          alt=""
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                    )}

                    <div className="flex-1 flex flex-col p-4">
                      {post.message && (
                        <p className="text-gray-300 text-sm leading-relaxed line-clamp-4 flex-1">
                          {post.message}
                        </p>
                      )}

                      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-500">
                        <span>{timeAgo(post.createdTime)}</span>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <FaThumbsUp className="text-blue-500" /> {formatCount(post.likeCount)}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaComment className="text-gold-500" /> {formatCount(post.commentCount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </>
        ) : (
          // Not configured yet, or the request failed — graceful fallback
          // to Facebook's own official widget instead of a broken section.
          <FallbackWidget />
        )}

        <div className="flex justify-center">
          <a
            href={FACEBOOK_PAGE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-8 sm:mt-10 bg-gold-500 hover:bg-gold-600 text-black px-8 py-3.5 rounded-lg font-semibold transition-all"
          >
            Visit Our Facebook Page
            <FaExternalLinkAlt className="text-xs" />
          </a>
        </div>
      </div>
    </section>
  )
}
