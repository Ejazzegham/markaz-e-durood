'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
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
  FaStar
} from 'react-icons/fa'

export default function BooksResources() {
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const [isClient, setIsClient] = useState(false)
  const itemsPerPage = 12
  
  // Ref for the grid container
  const gridRef = useRef<HTMLDivElement>(null)
  
  // Full Books Collection
  const allBooks = generateBooksCollection()
  
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
      <div className="min-h-screen bg-gradient-to-b from-[#0a1a10] via-[#112c1b] to-[#0a1a10] flex items-center justify-center">
        <div className="text-[#D4AF37] text-xl">Loading Books...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1a10] via-[#112c1b] to-[#0a1a10] relative overflow-hidden">
      
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
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D4AF37]/3 rounded-full blur-[150px]"></div>
      </div>

      <div className="absolute top-10 left-10 w-20 h-20 border-t-2 border-l-2 border-[#D4AF37]/10 rounded-tl-2xl"></div>
      <div className="absolute top-10 right-10 w-20 h-20 border-t-2 border-r-2 border-[#D4AF37]/10 rounded-tr-2xl"></div>
      <div className="absolute bottom-10 left-10 w-20 h-20 border-b-2 border-l-2 border-[#D4AF37]/10 rounded-bl-2xl"></div>
      <div className="absolute bottom-10 right-10 w-20 h-20 border-b-2 border-r-2 border-[#D4AF37]/10 rounded-br-2xl"></div>

      {/* ============================================
          CONTENT
          ============================================ */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ============================================
            PREMIUM TITLE BAR
            ============================================ */}
        <div className="relative mb-10">
          <div className="absolute inset-0 bg-[#D4AF37]/5 rounded-2xl blur-2xl"></div>
          
          <div className="relative bg-gradient-to-r from-[#112c1b]/90 via-[#1a4d2e]/80 to-[#112c1b]/90 backdrop-blur-xl border border-[#D4AF37]/20 rounded-2xl overflow-hidden shadow-2xl shadow-[#D4AF37]/5">
            
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-6 md:px-8 py-4">
              
              <div className="flex items-center gap-4">
                <Link 
                  href="/" 
                  className="group relative p-2.5 rounded-xl bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/20 hover:border-[#D4AF37]/40 text-[#D4AF37] transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <FaArrowLeft className="relative group-hover:-translate-x-1 transition-transform text-sm" />
                </Link>
                
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#D4AF37]/20 rounded-xl blur-lg"></div>
                    <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-[#D4AF37]/30 to-[#D4AF37]/10 border border-[#D4AF37]/30">
                      <FaBook className="text-[#D4AF37] text-xl" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                      <span className="text-white">Books</span>
                      <span className="text-[#D4AF37]"> & PDFs</span>
                    </h1>
                    <p className="text-gray-400 text-xs hidden sm:block">
                      Access Islamic books and downloadable resources
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                  <FaFilePdf className="text-[#D4AF37] text-xs" />
                  <span className="text-gray-300 text-xs font-medium">{allBooks.length} Books</span>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                  <FaHeart className="text-[#D4AF37] text-xs" />
                  <span className="text-gray-300 text-xs font-medium">Featured</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================
            BOOKS GRID
            ============================================ */}
        <div 
          ref={gridRef}
          id="books-grid" 
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 scroll-mt-40"
        >
          {currentBooks.map((book, index) => (
            <div 
              key={index} 
              className="group relative transition-all duration-500 hover:-translate-y-2"
            >
              <div className="absolute -inset-2 bg-gradient-to-b from-[#D4AF37]/10 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="relative bg-gradient-to-br from-[#1a3d2a]/90 via-[#1a4d2e]/80 to-[#112c1b]/90 backdrop-blur-2xl border border-[#D4AF37]/20 hover:border-[#D4AF37]/40 rounded-xl p-4 transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-[#D4AF37]/10 overflow-hidden">
                
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent rounded-t-xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-[#D4AF37]/5 to-transparent rounded-b-xl pointer-events-none"></div>

                <div className="absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b from-[#D4AF37] via-[#D4AF37]/50 to-transparent rounded-l-xl"></div>

                <div className="absolute top-2 right-3 text-[10px] font-mono font-medium text-[#D4AF37]/20">
                  {String(startIndex + index + 1).padStart(2, '0')}
                </div>

                <div className="relative z-10">
                  
                  {/* Book Icon */}
                  <div className="mb-3">
                    <div className="w-14 h-14 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20 group-hover:border-[#D4AF37]/40 transition-all">
                      <FaBookOpen className="text-[#D4AF37] text-2xl group-hover:scale-110 transition-transform" />
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-0.5 group-hover:text-[#D4AF37] transition-colors line-clamp-1">
                    {book.title}
                  </h3>

                  <p className="text-gray-400 text-[11px] flex items-center gap-1.5 mb-1.5">
                    <FaUser className="text-[#D4AF37] text-[10px]" />
                    {book.author}
                  </p>

                  <p className="text-gray-500 text-[10px] leading-relaxed mb-2 line-clamp-2">
                    {book.description}
                  </p>

                  <div className="flex items-center gap-3 text-[10px] text-gray-500 mb-2 pb-2 border-b border-[#D4AF37]/10">
                    <span className="flex items-center gap-1">
                      <FaFilePdf className="text-[#D4AF37] text-[10px]" />
                      PDF
                    </span>
                    <span className="flex items-center gap-1">
                      <FaStar className="text-[#D4AF37] text-[10px]" />
                      {book.rating}
                    </span>
                  </div>

                  {/* Download Button - FIXED with proper handling */}
                  <button 
                    onClick={() => handleDownload(book.pdfUrl, book.title)}
                    className="w-full bg-[#D4AF37] hover:bg-[#c9a030] text-green-950 font-semibold text-xs py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 mt-1 shadow-lg shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/40"
                  >
                    <FaDownload className="text-[10px]" />
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ============================================
            PAGINATION
            ============================================ */}
        {totalPages > 1 && (
          <div className="mt-10 flex flex-col items-center gap-3">
            <p className="text-gray-500 text-xs">
              Showing <span className="text-[#D4AF37] font-semibold">{startIndex + 1}</span> to{' '}
              <span className="text-[#D4AF37] font-semibold">
                {Math.min(endIndex, allBooks.length)}
              </span>{' '}
              of <span className="text-[#D4AF37] font-semibold">{allBooks.length}</span> Books
            </p>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg border transition-all duration-300 ${
                  currentPage === 1
                    ? 'border-[#D4AF37]/10 text-[#D4AF37]/30 cursor-not-allowed'
                    : 'border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/50'
                }`}
              >
                <FaChevronLeft className="text-xs" />
              </button>

              <div className="flex items-center gap-0.5">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum
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
                          ? 'bg-[#D4AF37] text-green-950 shadow-lg shadow-[#D4AF37]/30'
                          : 'text-gray-400 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10'
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
                    ? 'border-[#D4AF37]/10 text-[#D4AF37]/30 cursor-not-allowed'
                    : 'border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/50'
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
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#D4AF37]/30"></div>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-[#D4AF37]/40"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-lg shadow-[#D4AF37]/50"></div>
            <div className="w-1 h-1 rounded-full bg-[#D4AF37]/40"></div>
          </div>
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#D4AF37]/30"></div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-[10px] text-gray-600 tracking-wider">
            <FaBookOpen className="inline mr-1.5 text-[#D4AF37]/30 text-[10px]" />
            Expand your knowledge with authentic Islamic books
          </p>
        </div>

      </div>
    </div>
  )
}

// ============================================
// BOOKS DATA - ADD NEW BOOKS HERE
// ============================================
function generateBooksCollection() {
  const booksData = [
    {
      title: 'Virtues of Durood Shareef',
      author: 'Islamic Scholars',
      description: 'A comprehensive guide to the virtues and benefits of sending Durood upon the Prophet ﷺ',
      rating: '4.9',
      pdfUrl: '/books/virtues-of-durood.pdf'
    },
    {
      title: '40 Durood Shareef',
      author: 'Traditional Collection',
      description: 'Collection of 40 authentic Durood with their meanings, benefits and Arabic text',
      rating: '4.8',
      pdfUrl: '/books/40-durood-shareef.pdf'
    },
    {
      title: 'Durood in Daily Life',
      author: 'Practical Guide',
      description: 'How to incorporate Durood into your daily routine for maximum blessings and spiritual growth',
      rating: '4.7',
      pdfUrl: '/books/durood-in-daily-life.pdf'
    },
    {
      title: 'Durood and Spiritual Healing',
      author: 'Spiritual Guide',
      description: 'Discover how Durood can heal the heart, mind and soul through the blessings of the Prophet ﷺ',
      rating: '4.8',
      pdfUrl: '/books/durood-spiritual-healing.pdf'
    },
    {
      title: 'The Power of Durood',
      author: 'Islamic Research',
      description: 'Understanding the spiritual power of sending blessings upon the Prophet Muhammad ﷺ',
      rating: '4.6',
      pdfUrl: '/books/power-of-durood.pdf'
    },
    {
      title: 'Durood Collection',
      author: 'Compiled Collection',
      description: 'Complete collection of all authentic Durood Shareef with Arabic text and translations',
      rating: '4.9',
      pdfUrl: '/books/durood-collection.pdf'
    },
    {
      title: 'Sahih Durood',
      author: 'Hadith Scholars',
      description: 'Authentic Durood from Sahih Ahadith with references and explanations',
      rating: '4.7',
      pdfUrl: '/books/sahih-durood.pdf'
    },
    {
      title: 'The Life of Prophet ﷺ',
      author: 'Seerah Scholars',
      description: 'A comprehensive biography of the Prophet Muhammad ﷺ and his teachings',
      rating: '4.9',
      pdfUrl: '/books/life-of-prophet.pdf'
    },
    {
      title: 'Islamic Manners',
      author: 'Islamic Etiquette',
      description: 'A guide to Islamic manners, etiquette and daily practices for Muslims',
      rating: '4.6',
      pdfUrl: '/books/islamic-manners.pdf'
    },
    {
      title: 'Tafsir of Quran',
      author: 'Quran Scholars',
      description: 'Exegesis and explanation of the Holy Quran with contextual understanding',
      rating: '4.8',
      pdfUrl: '/books/tafsir-quran.pdf'
    },
    {
      title: 'Hadith Collection',
      author: 'Hadith Compilers',
      description: 'A collection of authentic Hadith about Durood and the Prophet ﷺ',
      rating: '4.7',
      pdfUrl: '/books/hadith-collection.pdf'
    },
    {
      title: 'Sufi Teachings',
      author: 'Sufi Scholars',
      description: 'Teachings of Sufism and spiritual purification through Islamic mysticism',
      rating: '4.5',
      pdfUrl: '/books/sufi-teachings.pdf'
    },
    {
      title: 'The Straight Path',
      author: 'Islamic Guidance',
      description: 'Guidance on finding and following the straight path in Islam',
      rating: '4.8',
      pdfUrl: '/books/straight-path.pdf'
    },
    {
      title: 'Love for the Prophet',
      author: 'Spiritual Guide',
      description: 'How to develop and increase love for the Prophet Muhammad ﷺ',
      rating: '4.9',
      pdfUrl: '/books/love-for-prophet.pdf'
    },
    {
      title: 'Islamic Ethics',
      author: 'Islamic Scholars',
      description: 'Understanding Islamic ethics, morals and character development',
      rating: '4.6',
      pdfUrl: '/books/islamic-ethics.pdf'
    },
    {
      title: 'The Day of Judgement',
      author: 'Islamic Research',
      description: 'Signs, events and preparation for the Day of Judgement in Islam',
      rating: '4.7',
      pdfUrl: '/books/day-of-judgement.pdf'
    }
  ]

  return booksData
}