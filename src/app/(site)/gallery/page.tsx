'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { FaImages, FaArrowLeft, FaSpinner, FaCamera, FaHeart, FaExpand, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import ImageLightbox from '@/components/resources/ImageLightbox'

interface GalleryItem {
  id: string
  title?: string | null
  imageUrl: string
  category: string
}

export default function Gallery() {
  const [images, setImages] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 16
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/content/gallery')
      .then((res) => res.json())
      .then((data) => setImages(data.items || []))
      .finally(() => setLoading(false))
  }, [])

  // Calculate pagination
  const totalPages = Math.ceil(images.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentImages = images.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      setTimeout(() => {
        if (gridRef.current) {
          const yOffset = -160
          const y = gridRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset
          window.scrollTo({ top: y, behavior: 'smooth' })
        }
      }, 100)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-950 via-green-850 to-green-950 relative overflow-hidden">

      {/* ============================================
          PREMIUM BACKGROUND LAYERS
          ============================================ */}

      <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 80px, #D4AF37 80px, #D4AF37 81px),
            repeating-linear-gradient(90deg, transparent, transparent 80px, #D4AF37 80px, #D4AF37 81px),
            repeating-linear-gradient(45deg, transparent, transparent 160px, rgba(212, 175, 55, 0.3) 160px, rgba(212, 175, 55, 0.3) 161px),
            repeating-linear-gradient(-45deg, transparent, transparent 160px, rgba(212, 175, 55, 0.3) 160px, rgba(212, 175, 55, 0.3) 161px)
          `
        }} />
      </div>

      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundSize: '300px 300px'
      }} />

      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold-500/3 rounded-full blur-[150px]"></div>
      </div>

      <div className="absolute top-10 left-10 w-20 h-20 border-t-2 border-l-2 border-gold-500/10 rounded-tl-2xl"></div>
      <div className="absolute top-10 right-10 w-20 h-20 border-t-2 border-r-2 border-gold-500/10 rounded-tr-2xl"></div>
      <div className="absolute bottom-10 left-10 w-20 h-20 border-b-2 border-l-2 border-gold-500/10 rounded-bl-2xl"></div>
      <div className="absolute bottom-10 right-10 w-20 h-20 border-b-2 border-r-2 border-gold-500/10 rounded-br-2xl"></div>

      {/* ============================================
          CONTENT
          ============================================ */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ============================================
            PREMIUM TITLE BAR
            ============================================ */}
        <div className="relative mb-10">
          <div className="absolute inset-0 bg-gold-500/5 rounded-2xl blur-2xl"></div>

          <div className="relative bg-gradient-to-r from-green-850/90 via-green-900/80 to-green-850/90 backdrop-blur-xl border border-gold-500/20 rounded-2xl overflow-hidden shadow-2xl shadow-gold-500/5">

            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-6 md:px-8 py-4">

              <div className="flex items-center gap-4">
                <Link
                  href="/"
                  className="group relative p-2.5 rounded-xl bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/20 hover:border-gold-500/40 text-gold-500 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gold-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <FaArrowLeft className="relative group-hover:-translate-x-1 transition-transform text-sm" />
                </Link>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gold-500/20 rounded-xl blur-lg"></div>
                    <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-gold-500/30 to-gold-500/10 border border-gold-500/30">
                      <FaImages className="text-gold-500 text-xl" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                      <span className="text-white">Photo</span>
                      <span className="text-gold-500"> Gallery</span>
                    </h1>
                    <p className="text-gray-400 text-xs hidden sm:block">
                      Moments from our community, events, and masajid
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gold-500/10 border border-gold-500/20">
                  <FaCamera className="text-gold-500 text-xs" />
                  <span className="text-gray-300 text-xs font-medium">{images.length} Photos</span>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gold-500/10 border border-gold-500/20">
                  <FaHeart className="text-gold-500 text-xs" />
                  <span className="text-gray-300 text-xs font-medium">Featured</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================
            GALLERY GRID
            ============================================ */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-500 text-sm">
            <FaSpinner className="animate-spin mr-2" /> Loading pictures...
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-sm">No pictures have been added yet. Check back soon!</p>
          </div>
        ) : (
          <div ref={gridRef} className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 scroll-mt-40">
            {currentImages.map((img, idx) => (
              <button
                key={img.id}
                onClick={() => setLightboxIndex(idx)}
                className="group relative block w-full text-left break-inside-avoid rounded-xl overflow-hidden border border-gold-500/20 hover:border-gold-500/40 bg-gradient-to-br from-green-825/90 via-green-900/80 to-green-850/90 backdrop-blur-2xl transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-gold-500/10"
              >
                <div className="relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.imageUrl} alt={img.title || 'Gallery image'} className="w-full h-auto group-hover:scale-105 transition-transform duration-500" />
                  {/* Hover overlay hinting the image opens full-screen */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center">
                      <FaExpand className="text-green-950 text-sm" />
                    </div>
                  </div>
                </div>
                {img.title && (
                  <p className="text-gray-300 text-xs p-2.5 border-t border-gold-500/10">{img.title}</p>
                )}
              </button>
            ))}
          </div>
        )}

        {/* ============================================
            FULL-SCREEN LIGHTBOX (opens on image click)
            View all images with Left / Right navigation
            ============================================ */}
        {lightboxIndex !== null && (
          <ImageLightbox
            images={currentImages}
            index={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onIndexChange={setLightboxIndex}
          />
        )}

        {/* ============================================
            PAGINATION
            ============================================ */}
        {totalPages > 1 && (
          <div className="mt-10 flex flex-col items-center gap-3">
            <p className="text-gray-500 text-xs">
              Showing <span className="text-gold-500 font-semibold">{startIndex + 1}</span> to{' '}
              <span className="text-gold-500 font-semibold">
                {Math.min(endIndex, images.length)}
              </span>{' '}
              of <span className="text-gold-500 font-semibold">{images.length}</span> Photos
            </p>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg border transition-all duration-300 ${
                  currentPage === 1
                    ? 'border-gold-500/10 text-gold-500/30 cursor-not-allowed'
                    : 'border-gold-500/30 text-gold-500 hover:bg-gold-500/10 hover:border-gold-500/50'
                }`}
              >
                <FaChevronLeft className="text-xs" />
              </button>

              <div className="flex items-center gap-0.5">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => goToPage(pageNum)}
                      className={`w-8 h-8 rounded-lg font-medium text-xs transition-all duration-300 ${
                        pageNum === currentPage
                          ? 'bg-gold-500 text-green-950 shadow-lg shadow-gold-500/30'
                          : 'text-gray-400 hover:text-gold-500 hover:bg-gold-500/10'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg border transition-all duration-300 ${
                  currentPage === totalPages
                    ? 'border-gold-500/10 text-gold-500/30 cursor-not-allowed'
                    : 'border-gold-500/30 text-gold-500 hover:bg-gold-500/10 hover:border-gold-500/50'
                }`}
              >
                <FaChevronRight className="text-xs" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================
            BOTTOM DECORATION
            ============================================ */}
        <div className="mt-16 flex items-center justify-center gap-4">
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-gold-500/30"></div>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-gold-500/40"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-gold-500 shadow-lg shadow-gold-500/50"></div>
            <div className="w-1 h-1 rounded-full bg-gold-500/40"></div>
          </div>
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-gold-500/30"></div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-[10px] text-gray-600 tracking-wider">
            <FaImages className="inline mr-1.5 text-gold-500/30 text-[10px]" />
            Capturing the spirit of our community
          </p>
        </div>

      </div>
    </div>
  )
}
