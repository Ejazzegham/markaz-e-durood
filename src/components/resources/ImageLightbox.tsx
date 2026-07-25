'use client'

import { useCallback, useEffect } from 'react'
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa'

export interface LightboxImage {
  id: string
  imageUrl: string
  title?: string | null
}

interface ImageLightboxProps {
  images: LightboxImage[]
  index: number
  onClose: () => void
  onIndexChange: (index: number) => void
}

export default function ImageLightbox({ images, index, onClose, onIndexChange }: ImageLightboxProps) {
  const total = images.length
  const current = images[index]

  const goPrev = useCallback(() => {
    onIndexChange((index - 1 + total) % total)
  }, [index, total, onIndexChange])

  const goNext = useCallback(() => {
    onIndexChange((index + 1) % total)
  }, [index, total, onIndexChange])

  // Keyboard controls: Esc to close, arrows to navigate
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [goPrev, goNext, onClose])

  // Lock page scroll while the lightbox is open
  useEffect(() => {
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [])

  if (!current) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-gold-500 text-white hover:text-green-950 flex items-center justify-center border border-white/20 transition-colors"
      >
        <FaTimes />
      </button>

      {/* Counter */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-medium">
        {index + 1} / {total}
      </div>

      {/* Previous button */}
      {total > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            goPrev()
          }}
          aria-label="Previous image"
          className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-gold-500 text-white hover:text-green-950 flex items-center justify-center border border-white/20 transition-colors"
        >
          <FaChevronLeft />
        </button>
      )}

      {/* Next button */}
      {total > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            goNext()
          }}
          aria-label="Next image"
          className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-gold-500 text-white hover:text-green-950 flex items-center justify-center border border-white/20 transition-colors"
        >
          <FaChevronRight />
        </button>
      )}

      {/* Image + caption */}
      <div
        className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current.imageUrl}
          alt={current.title || 'Gallery image'}
          className="max-w-full max-h-[75vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
        />
        {current.title && (
          <p className="mt-4 text-gray-200 text-sm text-center px-4">{current.title}</p>
        )}
      </div>
    </div>
  )
}
