'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { FaFacebook, FaExternalLinkAlt } from 'react-icons/fa'

// ============================================================
// FACEBOOK PAGE SECTION
// ============================================================
// Embeds our full Facebook Page directly on the home page using
// Facebook's official "Page Plugin" (an iframe served by Facebook
// itself). Because Facebook renders the iframe live from the real
// page, the timeline shown here — posts, photos, videos, cover
// photo, follower count — updates automatically the moment
// something new is posted on Facebook. Nothing on this site needs
// to be touched to keep it current.
//
// The embed width is measured from its container with a
// ResizeObserver and passed to Facebook's iframe URL, so it fills
// the full section width on desktop and shrinks to fit small
// phone screens instead of sitting inside a small fixed-size box.
//
// Page: https://www.facebook.com/sultanfiazulhassan
// ============================================================

const FACEBOOK_PAGE_URL = 'https://www.facebook.com/sultanfiazulhassan'
const FB_HEIGHT = 800 // fixed feed height — posts scroll inside it

export default function FacebookSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const resizeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [pluginWidth, setPluginWidth] = useState<number | null>(null)
  const [loaded, setLoaded] = useState(false)

  const measure = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    // Facebook's page plugin supports roughly 180–1500px
    const w = Math.floor(el.clientWidth)
    const clamped = Math.max(300, Math.min(w, 1500))
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
  const pluginSrc = pluginWidth
    ? `https://www.facebook.com/plugins/page.php?href=${encodedHref}` +
      `&tabs=timeline&width=${pluginWidth}&height=${FB_HEIGHT}&small_header=false` +
      `&adapt_container_width=true&hide_cover=false&show_facepile=true`
    : null

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
            Stay connected with our latest pictures, videos and updates —
            this feed is live and updates automatically the moment we post
            on Facebook.
          </p>
        </div>

        {/* Live Facebook Page embed — full width premium card */}
        <div
          ref={containerRef}
          className="relative w-full rounded-3xl border border-gold-500/20 bg-gradient-to-b from-white/[0.05] to-black/40 backdrop-blur-xl p-3 sm:p-6 lg:p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)]"
        >
          {/* Thin top accent line, matches the site's other premium cards */}
          <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-gold-400/70 to-transparent" />

          {/* Loading skeleton, shown until the iframe reports it has loaded */}
          {!loaded && (
            <div
              className="w-full rounded-2xl bg-white/5 animate-pulse flex items-center justify-center"
              style={{ height: FB_HEIGHT }}
            >
              <FaFacebook className="text-white/10 text-6xl" />
            </div>
          )}

          {pluginSrc && (
            <div
              className="w-full flex justify-center"
              style={{ minHeight: loaded ? undefined : 0, height: loaded ? FB_HEIGHT : 0, overflow: 'hidden' }}
            >
              <iframe
                key={pluginWidth}
                src={pluginSrc}
                width={pluginWidth ?? undefined}
                height={FB_HEIGHT}
                style={{ border: 'none', overflow: 'hidden', width: '100%', maxWidth: '100%' }}
                scrolling="no"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                title="Markaz-e-Durood Facebook Page"
                onLoad={() => setLoaded(true)}
              />
            </div>
          )}
        </div>

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
