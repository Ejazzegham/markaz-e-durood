'use client'

import { useEffect, useRef } from 'react'
import { FaFacebook, FaExternalLinkAlt } from 'react-icons/fa'

// ============================================================
// FACEBOOK PAGE SECTION — full-width, official responsive embed
// ============================================================
// Uses Facebook's own JavaScript SDK ("fb-page" plugin with
// data-adapt-container-width="true") rather than a raw iframe URL.
// This is the officially documented way to get a Page Plugin that
// properly fills and centers in a wide, responsive container —
// a plain iframe URL only ever renders at one fixed pixel width,
// which is why a JS-measured width can get stuck small (e.g. if it
// reads a width of 0 on the very first render) and look pinned to
// the left with empty space beside it.
//
// The feed itself — posts, photos, videos, cover photo, follower
// count — still updates live the moment something new is posted on
// Facebook, no site changes needed to keep it current.
//
// Page: https://www.facebook.com/sultanfiazulhassan
// ============================================================

const FACEBOOK_PAGE_URL = 'https://www.facebook.com/sultanfiazulhassan'
const FB_HEIGHT = 800

declare global {
  interface Window {
    FB?: { XFBML: { parse: (el?: HTMLElement) => void } }
  }
}

export default function FacebookSection() {
  const pageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // fb-root is required once per page by the SDK.
    if (!document.getElementById('fb-root')) {
      const root = document.createElement('div')
      root.id = 'fb-root'
      document.body.prepend(root)
    }

    if (window.FB) {
      // SDK already loaded (e.g. client-side navigation) — just parse.
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

        {/* Live Facebook Page embed — full width, centered, premium card */}
        <div className="relative w-full rounded-3xl border border-gold-500/20 bg-gradient-to-b from-white/[0.05] to-black/40 backdrop-blur-xl p-3 sm:p-6 lg:p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)]">
          {/* Thin top accent line, matches the site's other premium cards */}
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
