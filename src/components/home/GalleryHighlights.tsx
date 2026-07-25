'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FaHeart, FaImages, FaArrowRight, FaExpand, FaSpinner } from 'react-icons/fa'
import ImageLightbox from '@/components/resources/ImageLightbox'

interface GalleryItem {
  id: string
  title?: string | null
  imageUrl: string
  category: string
  likes?: number
}

const LIKED_STORAGE_KEY = 'markaz-e-durood:liked-pictures'

function readLikedIds(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = window.localStorage.getItem(LIKED_STORAGE_KEY)
    return new Set(raw ? (JSON.parse(raw) as string[]) : [])
  } catch {
    return new Set()
  }
}

function writeLikedIds(ids: Set<string>) {
  try {
    window.localStorage.setItem(LIKED_STORAGE_KEY, JSON.stringify(Array.from(ids)))
  } catch {
    // Ignore write failures (e.g. private browsing) — liking still works
    // for the current session, it just won't be remembered next visit.
  }
}

export default function GalleryHighlights() {
  const [images, setImages] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set())
  const [poppingId, setPoppingId] = useState<string | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  useEffect(() => {
    setLikedIds(readLikedIds())
    fetch('/api/content/gallery')
      .then((res) => res.json())
      .then((data) => setImages((data.items || []).slice(0, 8)))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const toggleLike = async (e: React.MouseEvent, item: GalleryItem) => {
    e.stopPropagation()
    const isLiked = likedIds.has(item.id)
    const action = isLiked ? 'unlike' : 'like'

    // Optimistic update — the counter and heart respond instantly, then
    // reconcile with whatever the server actually stored.
    setImages((prev) =>
      prev.map((img) =>
        img.id === item.id
          ? { ...img, likes: Math.max(0, (img.likes || 0) + (isLiked ? -1 : 1)) }
          : img
      )
    )
    const nextLiked = new Set(likedIds)
    if (isLiked) nextLiked.delete(item.id)
    else nextLiked.add(item.id)
    setLikedIds(nextLiked)
    writeLikedIds(nextLiked)

    if (!isLiked) {
      setPoppingId(item.id)
      setTimeout(() => setPoppingId((cur) => (cur === item.id ? null : cur)), 400)
    }

    try {
      const res = await fetch(`/api/gallery/${item.id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      if (res.ok) {
        const data = await res.json()
        setImages((prev) => prev.map((img) => (img.id === item.id ? { ...img, likes: data.likes } : img)))
      }
    } catch {
      // Leave the optimistic value in place — a failed sync isn't worth
      // jarring the UI back for what's a purely decorative counter.
    }
  }

  if (!loading && images.length === 0) return null

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div className="text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 border border-green-200 mb-3">
              <FaImages className="text-green-700 text-xs" />
              <span className="text-green-800 text-xs font-semibold tracking-wider">GALLERY</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-green-900">Moments Worth Sharing</h2>
            <p className="text-gray-500 mt-1.5 max-w-xl">
              Glimpses from our events, gatherings and community — tap a picture to view it,
              or send it some love.
            </p>
          </div>

          <Link
            href="/gallery"
            className="inline-flex items-center justify-center gap-2 border border-green-700 text-green-800 hover:bg-green-800 hover:text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors shrink-0"
          >
            View Full Gallery
            <FaArrowRight className="text-xs" />
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <FaSpinner className="animate-spin mr-2" /> Loading gallery...
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
            {images.map((item, i) => {
              const liked = likedIds.has(item.id)
              return (
                <div
                  key={item.id}
                  onClick={() => setLightboxIndex(i)}
                  className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.title || 'Gallery picture'}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

                  {/* Expand hint */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white">
                      <FaExpand className="text-sm" />
                    </div>
                  </div>

                  {/* Caption */}
                  {(item.title || item.category) && (
                    <div className="absolute bottom-3 left-3 right-14">
                      {item.title && (
                        <p className="text-white text-sm font-semibold truncate drop-shadow">{item.title}</p>
                      )}
                      {item.category && (
                        <p className="text-gold-400 text-[11px] tracking-wide truncate">{item.category}</p>
                      )}
                    </div>
                  )}

                  {/* Like button + counter */}
                  <button
                    onClick={(e) => toggleLike(e, item)}
                    aria-label={liked ? 'Unlike this picture' : 'Like this picture'}
                    aria-pressed={liked}
                    className="absolute bottom-3 right-3 flex flex-col items-center gap-0.5 group/like"
                  >
                    <span
                      className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm border transition-all duration-200 ${
                        liked
                          ? 'bg-red-500 border-red-400 text-white'
                          : 'bg-white/15 border-white/30 text-white hover:bg-white/25'
                      } ${poppingId === item.id ? 'like-pop' : ''}`}
                    >
                      <FaHeart className="text-xs" />
                    </span>
                    <span className="text-white text-[10px] font-semibold drop-shadow tabular-nums">
                      {item.likes || 0}
                    </span>
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {lightboxIndex !== null && (
        <ImageLightbox
          images={images}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
        />
      )}
    </section>
  )
}
