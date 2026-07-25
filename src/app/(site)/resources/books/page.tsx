'use client'

import Link from 'next/link'
import { useState, useRef, useEffect, useMemo } from 'react'
import { 
  FaBook, 
  FaDownload, 
  FaArrowLeft, 
  FaUser, 
  FaHeart,
  FaChevronLeft,
  FaChevronRight,
  FaFilePdf,
  FaBookOpen,
  FaStar,
  FaCrown,
  FaSpinner
} from 'react-icons/fa'
import BookCarousel3D from '@/components/BookCarousel3D'

export default function BooksResources() {
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const [isClient, setIsClient] = useState(false)
  const itemsPerPage = 12

  // Ref for the grid container
  const gridRef = useRef<HTMLDivElement>(null)

  // Books Collection — loaded from the admin panel
  const [allBooks, setAllBooks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/content/books')
      .then((res) => res.json())
      .then((data) => setAllBooks(data.items || []))
      .finally(() => setLoading(false))
  }, [])

  // Featured subset (top rated) for the rotating 3D carousel
  const featuredBooks = useMemo(
    () => [...allBooks].sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured)).slice(0, 8),
    [allBooks]
  )
  
  // Calculate pagination
  const totalPages = Math.ceil(allBooks.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentBooks = allBooks.slice(startIndex, endIndex)

  // Fix hydration issues
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Page navigation with proper offset for fixed header
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

  useEffect(() => {
    if (gridRef.current && isClient) {
      const yOffset = -160
      const y = gridRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }, [currentPage, isClient])

  // Handle download - FIXED: Use Link with download attribute
  const handleDownload = (pdfUrl: string, title: string) => {
    if (typeof window !== 'undefined') {
      // Check if it's a valid PDF URL
      if (pdfUrl.startsWith('/') || pdfUrl.startsWith('http')) {
        window.open(pdfUrl, '_blank')
      } else {
        // Fallback - just show message
        alert(`Downloading: ${title}`)
      }
    }
  }

  // Don't render until client-side
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-950 via-green-850 to-green-950 flex items-center justify-center">
        <div className="text-gold-500 text-xl">Loading Books...</div>
      </div>
    )
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
                      <FaBook className="text-gold-500 text-xl" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                      <span className="text-white">Books</span>
                      <span className="text-gold-500"> & PDFs</span>
                    </h1>
                    <p className="text-gray-400 text-xs hidden sm:block">
                      Access Islamic books and downloadable resources
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gold-500/10 border border-gold-500/20">
                  <FaFilePdf className="text-gold-500 text-xs" />
                  <span className="text-gray-300 text-xs font-medium">{allBooks.length} Books</span>
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
            FEATURED COLLECTION - 3D ROTATING CAROUSEL
            ============================================ */}
        <div className="relative mb-14">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-8 sm:w-12 h-px bg-gradient-to-r from-transparent to-gold-500/50"></div>
            <FaCrown className="text-gold-500 text-sm" />
            <div className="w-8 sm:w-12 h-px bg-gradient-to-l from-transparent to-gold-500/50"></div>
          </div>
          <h2 className="text-center text-xl sm:text-2xl font-bold text-white mb-1">
            Featured <span className="text-gold-500">Collection</span>
          </h2>
          <p className="text-center text-gray-500 text-xs sm:text-sm mb-6">
            Our top-rated picks — use the arrows or tap a book to bring it forward
          </p>

          <BookCarousel3D books={featuredBooks} onDownload={handleDownload} />
        </div>

        {/* ============================================
            BOOKS GRID
            ============================================ */}
        <h2 className="text-center text-xl sm:text-2xl font-bold text-white mb-6">
          Full <span className="text-gold-500">Library</span>
        </h2>
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-500 text-sm">
            <FaSpinner className="animate-spin mr-2" /> Loading books...
          </div>
        ) : allBooks.length === 0 ? (
          <div className="text-center py-20">
            <FaBookOpen className="text-gold-500/20 text-5xl mx-auto mb-4" />
            <p className="text-gray-400 text-sm">No books have been added yet. Check back soon!</p>
          </div>
        ) : (
        <div 
          ref={gridRef}
          id="books-grid" 
          className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 scroll-mt-40"
        >
          {currentBooks.map((book, index) => (
            <div 
              key={index} 
              className="group relative transition-all duration-500 hover:-translate-y-1"
            >
              <div className="absolute -inset-2 bg-gradient-to-b from-gold-500/10 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

              {/* Horizontal card: cover/icon on the left, details on the right */}
              <div className="relative flex flex-row min-h-[132px] sm:min-h-[150px] bg-gradient-to-br from-green-825/90 via-green-900/80 to-green-850/90 backdrop-blur-2xl border border-gold-500/20 hover:border-gold-500/40 rounded-2xl transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-gold-500/10 overflow-hidden">

                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
                <div className="absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b from-gold-500 via-gold-500/50 to-transparent"></div>

                <div className="absolute top-2 right-3 text-[10px] font-mono font-medium text-gold-500/20 z-10">
                  {String(startIndex + index + 1).padStart(2, '0')}
                </div>

                {/* Cover image / fallback icon */}
                <div className="relative w-24 sm:w-32 flex-shrink-0 overflow-hidden">
                  {book.coverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gold-500/10">
                      <FaBookOpen className="text-gold-500 text-2xl sm:text-3xl group-hover:scale-110 transition-transform" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-green-900/50" />
                </div>

                {/* Details */}
                <div className="relative z-10 flex flex-col flex-1 min-w-0 p-3 sm:p-4">

                  <h3 className="text-sm sm:text-base font-bold text-white mb-1 group-hover:text-gold-500 transition-colors line-clamp-2">
                    {book.title}
                  </h3>

                  <p className="text-gray-400 text-xs flex items-center gap-1.5 mb-1.5">
                    <FaUser className="text-gold-500 text-[10px] flex-shrink-0" />
                    {book.author}
                  </p>

                  <p className="text-gray-500 text-xs leading-relaxed mb-2 line-clamp-2 flex-1">
                    {book.description}
                  </p>

                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 text-[10px] sm:text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <FaFilePdf className="text-gold-500 text-[10px]" />
                        PDF
                      </span>
                      <span className="flex items-center gap-1">
                        <FaStar className="text-gold-500 text-[10px]" />
                        {book.category || 'General'}
                      </span>
                    </div>

                    {/* Download Button - FIXED with proper handling */}
                    <button 
                      onClick={() => handleDownload(book.pdfUrl, book.title)}
                      className="flex-shrink-0 bg-gold-500 hover:bg-gold-600 text-green-950 font-semibold text-[10px] sm:text-xs py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-gold-500/20 hover:shadow-gold-500/40"
                    >
                      <FaDownload className="text-[10px]" />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}

        {/* ============================================
            PAGINATION
            ============================================ */}
        {totalPages > 1 && (
          <div className="mt-10 flex flex-col items-center gap-3">
            <p className="text-gray-500 text-xs">
              Showing <span className="text-gold-500 font-semibold">{startIndex + 1}</span> to{' '}
              <span className="text-gold-500 font-semibold">
                {Math.min(endIndex, allBooks.length)}
              </span>{' '}
              of <span className="text-gold-500 font-semibold">{allBooks.length}</span> Books
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
            <FaBookOpen className="inline mr-1.5 text-gold-500/30 text-[10px]" />
            Expand your knowledge with authentic Islamic books
          </p>
        </div>

      </div>
    </div>
  )
}

