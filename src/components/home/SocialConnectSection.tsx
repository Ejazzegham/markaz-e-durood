'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { FaFacebook, FaInstagram, FaExternalLinkAlt } from 'react-icons/fa'

// ============================================================
// SOCIAL CONNECT SECTION — Facebook (left) + Instagram (right)
// ============================================================
// Left: our Facebook Page, embedded live via Facebook's official
// "Page Plugin" iframe — it reflects new posts automatically.
//
// Right: an Instagram profile card. Unlike Facebook, Instagram does
// not offer a public, no-login "whole profile feed" widget — the only
// way to pull a live feed of real posts is Meta's Graph API, which
// needs a Business account + access token wired up server-side. Until
// that's set up, this is a polished card in the same visual language
// as the Facebook card, linking straight to the live profile.
//
// Facebook Page: https://www.facebook.com/sultanfiazulhassan
// Instagram: https://www.instagram.com/sultanfiazulhassan
// ============================================================

const FACEBOOK_PAGE_URL = 'https://www.facebook.com/sultanfiazulhassan'
const INSTAGRAM_URL =
  'https://www.instagram.com/sultanfiazulhassan?igsh=MWtndGNwNjVpYWRoNw%3D%3D'
const INSTAGRAM_HANDLE = '@sultanfiazulhassan'

const EMBED_HEIGHT = 560

export default function SocialConnectSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const resizeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [pluginWidth, setPluginWidth] = useState<number | null>(null)
  const [fbLoaded, setFbLoaded] = useState(false)

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

  return (
    <section
      className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-10 overflow-hidden"
      style={{ background: 'linear-gradient(to bottom, #071018, #02070d)' }}
    >
      {/* Decorative glows to match the site's premium look */}
      <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] bg-pink-500/5 rounded-full blur-[120px] pointer-events-none" />

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
            Stay connected with our latest posts, pictures and reels across
            Facebook and Instagram.
          </p>
        </div>

        {/* Two-column: Facebook (left) + Instagram (right) */}
        <div ref={containerRef} className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* ---------------- Facebook Page (left) ---------------- */}
          <div className="relative rounded-3xl border border-gold-500/20 bg-gradient-to-b from-white/[0.05] to-black/40 backdrop-blur-xl p-3 sm:p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] flex flex-col">
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

            <div className="flex justify-center mt-auto">
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

          {/* ---------------- Instagram (right) ---------------- */}
          <div
            className="relative rounded-3xl border border-gold-500/20 bg-gradient-to-b from-white/[0.05] to-black/40 backdrop-blur-xl p-3 sm:p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] flex flex-col"
            style={{ minHeight: EMBED_HEIGHT }}
          >
            <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-pink-400/70 to-transparent" />

            <div className="flex items-center gap-2 mb-4">
              <FaInstagram className="text-pink-400 text-lg" />
              <h3 className="text-white font-semibold">Our Instagram</h3>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-black/30 px-6 py-10 text-center">
              {/* Avatar ring, Instagram-style gradient */}
              <div
                className="w-24 h-24 rounded-full p-[3px] mb-5"
                style={{
                  background:
                    'linear-gradient(135deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5)',
                }}
              >
                <div className="w-full h-full rounded-full bg-ink-900 flex items-center justify-center">
                  <FaInstagram className="text-white text-4xl" />
                </div>
              </div>

              <p className="text-white font-semibold text-base">{INSTAGRAM_HANDLE}</p>
              <p className="text-gray-400 text-sm mt-2 max-w-xs">
                Reels, photos and moments from our gatherings — follow along
                on Instagram for the latest.
              </p>

              {/* Decorative preview grid — not real posts, purely visual */}
              <div className="grid grid-cols-3 gap-1.5 mt-7 w-full max-w-[220px]">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-md flex items-center justify-center"
                    style={{
                      background:
                        i % 2 === 0
                          ? 'linear-gradient(135deg, rgba(214,41,118,0.18), rgba(150,47,191,0.12))'
                          : 'linear-gradient(135deg, rgba(250,126,30,0.16), rgba(254,218,117,0.10))',
                    }}
                  >
                    <FaInstagram className="text-white/20 text-sm" />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-6 text-white px-6 py-3 rounded-lg font-semibold transition-all text-sm"
                style={{
                  background:
                    'linear-gradient(135deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5)',
                }}
              >
                Follow on Instagram
                <FaExternalLinkAlt className="text-xs" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
