'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { FaFacebook, FaYoutube, FaExternalLinkAlt } from 'react-icons/fa'

// ============================================================
// SOCIAL CONNECT SECTION — Facebook (left) + YouTube (right)
// ============================================================
// Two live, self-updating embeds side by side:
//  - Left: our Facebook Page (official Page Plugin iframe)
//  - Right: our YouTube channel (uploads-playlist iframe, so it
//    always reflects the latest video the moment it's posted)
//
// On smaller screens the two cards stack vertically, Facebook
// on top and YouTube below.
//
// Facebook Page: https://www.facebook.com/sultanfiazulhassan
// YouTube Channel: https://www.youtube.com/@SultanFiazulHassan-Qadri
// ============================================================

const FACEBOOK_PAGE_URL = 'https://www.facebook.com/sultanfiazulhassan'
const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@SultanFiazulHassan-Qadri'
// Uploads playlist for the channel (channel ID with "UC" swapped for "UU"),
// which YouTube keeps automatically in sync with newly published videos.
const YOUTUBE_CHANNEL_ID = 'UCLFXZpwfGcxsCB-nzCRyI1A'
const YOUTUBE_UPLOADS_PLAYLIST = `UU${YOUTUBE_CHANNEL_ID.slice(2)}`

const EMBED_HEIGHT = 500

export default function SocialConnectSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const resizeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [pluginWidth, setPluginWidth] = useState<number | null>(null)
  const [fbLoaded, setFbLoaded] = useState(false)
  const [ytLoaded, setYtLoaded] = useState(false)

  const measure = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    // Facebook's page plugin supports roughly 180–500px per column here
    const w = Math.floor(el.clientWidth)
    const clamped = Math.max(300, Math.min(w, 500))
    setPluginWidth((prev) => (prev === clamped ? prev : clamped))
  }, [])

  useEffect(() => {
    measure()

    const el = containerRef.current
    if (!el || typeof ResizeObserver === 'undefined') return

    const observer = new ResizeObserver(() => {
      // Debounce so the iframe (which remounts on width change) doesn't
      // reload dozens of times while the user is actively resizing/
      // rotating their phone.
      if (resizeTimer.current) clearTimeout(resizeTimer.current)
      resizeTimer.current = setTimeout(measure, 250)
    })
    observer.observe(el)

    return () => {
      observer.disconnect()
      if (resizeTimer.current) clearTimeout(resizeTimer.current)
    }
  }, [measure])

  const encodedHref = encodeURIComponent(FACEBOOK_PAGE_URL)
  const fbSrc = pluginWidth
    ? `https://www.facebook.com/plugins/page.php?href=${encodedHref}` +
      `&tabs=timeline&width=${pluginWidth}&height=${EMBED_HEIGHT}&small_header=false` +
      `&adapt_container_width=true&hide_cover=false&show_facepile=true`
    : null

  const ytSrc = `https://www.youtube.com/embed/videoseries?list=${YOUTUBE_UPLOADS_PLAYLIST}&rel=0`

  return (
    <section
      className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-10 overflow-hidden"
      style={{ background: 'linear-gradient(to bottom, #071018, #02070d)' }}
    >
      {/* Decorative glows to match the site's premium look */}
      <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20">
              <span className="text-gold-400 text-xs font-medium tracking-wider">STAY CONNECTED</span>
            </div>
          </div>

          <h2 className="text-gold-500 text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Follow Us Online
          </h2>
          <div className="flex justify-center mb-5">
            <div className="w-20 h-[2px] bg-gold-500"></div>
          </div>
          <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
            Stay connected with our latest posts, pictures and videos — both
            feeds below are live and update automatically the moment we
            post.
          </p>
        </div>

        {/* Two-column: Facebook (left) + YouTube (right) */}
        <div ref={containerRef} className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* ---------------- Facebook Page (left) ---------------- */}
          <div className="relative rounded-3xl border border-gold-500/20 bg-gradient-to-b from-white/[0.05] to-black/40 backdrop-blur-xl p-3 sm:p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)]">
            <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-gold-400/70 to-transparent" />

            <div className="flex items-center gap-2 mb-4">
              <FaFacebook className="text-blue-500 text-lg" />
              <h3 className="text-white font-semibold">Our Facebook Page</h3>
            </div>

            {!fbLoaded && (
              <div
                className="w-full rounded-2xl bg-white/5 animate-pulse flex items-center justify-center"
                style={{ height: EMBED_HEIGHT }}
              >
                <FaFacebook className="text-white/10 text-6xl" />
              </div>
            )}

            {fbSrc && (
              <div
                className="w-full flex justify-center"
                style={{ height: fbLoaded ? EMBED_HEIGHT : 0, overflow: 'hidden' }}
              >
                <iframe
                  key={pluginWidth}
                  src={fbSrc}
                  width={pluginWidth ?? undefined}
                  height={EMBED_HEIGHT}
                  style={{ border: 'none', overflow: 'hidden', width: '100%', maxWidth: '100%' }}
                  scrolling="no"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  title="Markaz-e-Durood Facebook Page"
                  onLoad={() => setFbLoaded(true)}
                />
              </div>
            )}

            <div className="flex justify-center">
              <a
                href={FACEBOOK_PAGE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-6 bg-gold-500 hover:bg-gold-600 text-black px-6 py-3 rounded-lg font-semibold transition-all text-sm"
              >
                Visit Our Facebook Page
                <FaExternalLinkAlt className="text-xs" />
              </a>
            </div>
          </div>

          {/* ---------------- YouTube Channel (right) ---------------- */}
          <div className="relative rounded-3xl border border-gold-500/20 bg-gradient-to-b from-white/[0.05] to-black/40 backdrop-blur-xl p-3 sm:p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)]">
            <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-gold-400/70 to-transparent" />

            <div className="flex items-center gap-2 mb-4">
              <FaYoutube className="text-red-500 text-lg" />
              <h3 className="text-white font-semibold">Our YouTube Channel</h3>
            </div>

            {!ytLoaded && (
              <div
                className="w-full rounded-2xl bg-white/5 animate-pulse flex items-center justify-center"
                style={{ height: EMBED_HEIGHT }}
              >
                <FaYoutube className="text-white/10 text-6xl" />
              </div>
            )}

            <div
              className="w-full rounded-2xl overflow-hidden bg-black"
              style={{ height: ytLoaded ? EMBED_HEIGHT : 0, overflow: 'hidden' }}
            >
              <iframe
                src={ytSrc}
                width="100%"
                height={EMBED_HEIGHT}
                style={{ border: 'none' }}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Markaz-e-Durood YouTube Channel"
                onLoad={() => setYtLoaded(true)}
              />
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="#youtube-channel"
                className="inline-flex items-center gap-2 mt-6 bg-gold-500 hover:bg-gold-600 text-black px-6 py-3 rounded-lg font-semibold transition-all text-sm"
              >
                Browse Full Channel & Shorts
              </a>
              <a
                href={YOUTUBE_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-6 border border-white/15 hover:bg-white/10 text-gray-300 px-6 py-3 rounded-lg font-semibold transition-all text-sm"
              >
                Open on YouTube
                <FaExternalLinkAlt className="text-xs" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
