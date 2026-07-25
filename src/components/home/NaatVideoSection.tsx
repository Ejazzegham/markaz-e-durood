'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FaPlay, FaMicrophone, FaArrowRight, FaSpinner } from 'react-icons/fa'

interface NaatItem {
  id: string
  title: string
  reciter: string
  youtubeId: string
  isFeatured?: boolean
}

function thumbFor(youtubeId: string) {
  return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
}

// Homepage preview of the Naat Shareef video library — a lighter version
// of the full Markaz-e-Naat / Resources theater, just enough to watch a
// few naats right here, with a link through to the full collection.
export default function NaatVideoSection() {
  const [items, setItems] = useState<NaatItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [autoplay, setAutoplay] = useState(false)

  useEffect(() => {
    let cancelled = false

    fetch('/api/content/naat')
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return
        const all: NaatItem[] = data.items || []
        // Featured naats surface first, then the rest by recency (the API
        // already orders by createdAt desc) — capped to a tidy preview.
        const sorted = [...all].sort(
          (a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0)
        )
        const preview = sorted.slice(0, 8)
        setItems(preview)
        if (preview.length) setActiveId(preview[0].id)
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const active = items.find((i) => i.id === activeId) || items[0]

  // Nothing added yet — skip the section rather than showing an empty block.
  if (!loading && items.length === 0) return null

  return (
    <section
      className="py-20 px-4"
      style={{ background: 'linear-gradient(to bottom, #071018, #02070d)' }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-gold-500 text-xs uppercase tracking-widest font-semibold mb-3">
            <FaMicrophone /> Naat Shareef
          </div>
          <h2 className="text-gold-500 text-4xl md:text-5xl font-bold mb-4">
            Naat Video Gallery
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Watch beautiful Naat Shareef videos from our reciters, in praise of
            the Prophet Muhammad ﷺ.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-500 text-sm">
            <FaSpinner className="animate-spin mr-2" /> Loading naat videos...
          </div>
        ) : (
          <>
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Player */}
              <div className="lg:col-span-2">
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-gold-500/20 bg-black shadow-2xl shadow-black/40">
                  {active && (
                    <iframe
                      key={active.id}
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${active.youtubeId}?rel=0${
                        autoplay ? '&autoplay=1' : ''
                      }`}
                      title={active.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  )}
                </div>
                {active && (
                  <div className="mt-4">
                    <h3 className="text-white font-semibold text-lg">{active.title}</h3>
                    <p className="text-gold-500 text-sm">{active.reciter}</p>
                  </div>
                )}
              </div>

              {/* Up next strip */}
              <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:max-h-[420px] scrollbar-hide pb-2 lg:pb-0">
                {items.map((item) => {
                  const isActive = item.id === active?.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveId(item.id)
                        setAutoplay(true)
                      }}
                      className={`group flex-shrink-0 w-64 lg:w-full flex items-center gap-3 rounded-xl border p-2 text-left transition-all ${
                        isActive
                          ? 'bg-gold-500/15 border-gold-500/40'
                          : 'bg-white/5 border-white/10 hover:border-gold-500/30 hover:bg-white/10'
                      }`}
                    >
                      <div className="relative w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-green-900">
                        <img
                          src={thumbFor(item.youtubeId)}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                          <FaPlay className="text-white text-xs" />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <p
                          className={`text-sm font-medium truncate ${
                            isActive ? 'text-white' : 'text-gray-300'
                          }`}
                        >
                          {item.title}
                        </p>
                        <p className="text-gray-500 text-xs truncate">{item.reciter}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/resources/naat"
                className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-ink-950 font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Watch More Naat Videos <FaArrowRight className="text-xs" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
