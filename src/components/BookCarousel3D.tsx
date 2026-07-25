'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { FaBookOpen, FaStar, FaChevronLeft, FaChevronRight, FaDownload } from 'react-icons/fa'

export interface CarouselBook {
  title: string
  author: string
  rating: string
  pdfUrl: string
  coverUrl?: string | null
}

interface BookCarousel3DProps {
  books: CarouselBook[]
  onDownload: (pdfUrl: string, title: string) => void
}

export default function BookCarousel3D({ books, onDownload }: BookCarousel3DProps) {
  const count = books.length
  const angleStep = count > 0 ? 360 / count : 0

  const [rotation, setRotation] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [snapping, setSnapping] = useState(false)

  const rafRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number>(0)
  const manualUntilRef = useRef<number>(0)
  const snapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Continuous auto-rotation, paused on hover or briefly after manual interaction
  useEffect(() => {
    const speed = 7 // degrees per second

    const loop = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time
      const delta = (time - lastTimeRef.current) / 1000
      lastTimeRef.current = time

      if (!hovered && Date.now() > manualUntilRef.current) {
        setRotation((prev) => (prev + speed * delta) % 360)
      }

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      lastTimeRef.current = 0
    }
  }, [hovered])

  const triggerSnap = () => {
    setSnapping(true)
    if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current)
    snapTimeoutRef.current = setTimeout(() => setSnapping(false), 700)
  }

  const pauseAutoRotate = (ms: number) => {
    manualUntilRef.current = Date.now() + ms
  }

  const rotateBy = (deltaDeg: number) => {
    pauseAutoRotate(5000)
    triggerSnap()
    setRotation((prev) => (prev + deltaDeg + 360) % 360)
  }

  const focusBook = (index: number) => {
    pauseAutoRotate(5000)
    triggerSnap()
    const targetAngle = index * angleStep
    setRotation(((-targetAngle % 360) + 360) % 360)
  }

  // Figure out which book currently faces the viewer
  const activeIndex = useMemo(() => {
    let best = 0
    let bestDist = Infinity
    books.forEach((_, i) => {
      const itemAngle = i * angleStep
      const effective = ((itemAngle + rotation) % 360 + 360) % 360
      const dist = Math.min(effective, 360 - effective)
      if (dist < bestDist) {
        bestDist = dist
        best = i
      }
    })
    return best
  }, [rotation, angleStep, books])

  // All hooks above run unconditionally on every render — safe to bail out
  // with a placeholder now that there's nothing left that depends on order.
  if (!books || books.length === 0) {
    return (
      <div className="w-full h-[300px] sm:h-[380px] flex items-center justify-center">
        <p className="text-gray-500 text-sm">No featured books yet</p>
      </div>
    )
  }

  const activeBook = books[activeIndex]

  return (
    <div className="w-full">
      <div
        className="book-carousel-perspective relative h-[300px] sm:h-[380px] flex items-center justify-center select-none"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Prev / Next arrows */}
        <button
          onClick={() => rotateBy(-angleStep)}
          aria-label="Rotate to previous book"
          className="absolute left-1 sm:-left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-green-850/90 border border-gold-500/30 text-gold-500 flex items-center justify-center hover:bg-gold-500/20 hover:border-gold-500/60 transition-all backdrop-blur-md shadow-lg"
        >
          <FaChevronLeft className="text-xs sm:text-sm" />
        </button>
        <button
          onClick={() => rotateBy(angleStep)}
          aria-label="Rotate to next book"
          className="absolute right-1 sm:-right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-green-850/90 border border-gold-500/30 text-gold-500 flex items-center justify-center hover:bg-gold-500/20 hover:border-gold-500/60 transition-all backdrop-blur-md shadow-lg"
        >
          <FaChevronRight className="text-xs sm:text-sm" />
        </button>

        {/* Ground glow beneath the ring */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-52 h-8 sm:w-72 sm:h-10 bg-gold-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div
          className="book-carousel-stage"
          style={{
            transform: `rotateY(${rotation}deg)`,
            transition: snapping ? 'transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)' : 'none'
          }}
        >
          {books.map((book, i) => {
            const itemAngle = i * angleStep
            const isFront = i === activeIndex

            return (
              <div
                key={i}
                className="book-carousel-item cursor-pointer"
                style={{ transform: `rotateY(${itemAngle}deg) translateZ(var(--carousel-radius))` }}
                onClick={() => focusBook(i)}
              >
                <div
                  className={`relative w-full h-full rounded-r-2xl rounded-l-md overflow-hidden transition-all duration-500 ${
                    isFront
                      ? 'scale-105 shadow-[0_10px_40px_rgba(212,175,55,0.45)]'
                      : 'scale-95 opacity-70'
                  }`}
                >
                  {/* Cover background */}
                  {book.coverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="absolute inset-0 w-full h-full object-cover border border-gold-500/30 rounded-r-2xl rounded-l-md"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-[#123a24] to-green-950 border border-gold-500/30 rounded-r-2xl rounded-l-md" />
                  )}
                  {/* Bottom gradient so text stays readable over a photo cover */}
                  {book.coverUrl && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/10 rounded-r-2xl rounded-l-md" />
                  )}
                  {/* Spine shadow */}
                  <div className="absolute left-0 top-0 bottom-0 w-2 bg-black/30" />
                  {/* Page-edge highlight */}
                  <div className="absolute right-0 top-1 bottom-1 w-1 bg-gradient-to-b from-white/10 via-white/5 to-white/10" />
                  {/* Corner ornament */}
                  <div className="absolute top-2 right-3 w-4 h-4 border-t border-r border-gold-500/30 rounded-tr" />
                  <div className="absolute bottom-2 right-3 w-4 h-4 border-b border-r border-gold-500/30 rounded-br" />

                  <div className={`relative h-full flex flex-col items-center text-center px-3 sm:px-4 ${
                    book.coverUrl ? 'justify-end pb-3 sm:pb-4' : 'justify-center'
                  }`}>
                    {!book.coverUrl && (
                      <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-gold-500/15 border border-gold-500/40 flex items-center justify-center mb-2 sm:mb-3">
                        <FaBookOpen className="text-gold-500 text-sm sm:text-lg" />
                      </div>
                    )}
                    <h4 className="text-white font-bold text-xs sm:text-sm leading-snug line-clamp-3 drop-shadow">
                      {book.title}
                    </h4>
                    <p className="text-gray-300 text-[9px] sm:text-[11px] mt-1 drop-shadow">{book.author}</p>
                    <div className="flex items-center gap-1 mt-1.5 sm:mt-2 text-gold-500 text-[9px] sm:text-[10px]">
                      <FaStar />
                      {book.rating}
                    </div>

                    {isFront && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onDownload(book.pdfUrl, book.title)
                        }}
                        className="mt-2 sm:mt-3 inline-flex items-center gap-1.5 bg-gold-500 hover:bg-gold-600 text-green-950 text-[10px] sm:text-[11px] font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg shadow-md transition-colors"
                      >
                        <FaDownload className="text-[9px] sm:text-[10px]" />
                        Download
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Active book caption */}
      <div className="text-center mt-4">
        <h3 className="text-white font-bold text-base sm:text-lg">{activeBook.title}</h3>
        <p className="text-gray-500 text-xs sm:text-sm">{activeBook.author}</p>
      </div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {books.map((book, i) => (
          <button
            key={i}
            onClick={() => focusBook(i)}
            aria-label={`Show ${book.title}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === activeIndex ? 'w-6 bg-gold-500' : 'w-1.5 bg-gold-500/30 hover:bg-gold-500/60'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
