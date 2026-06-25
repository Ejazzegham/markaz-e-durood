'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { 
  FaNewspaper, 
  FaArrowLeft, 
  FaCalendar, 
  FaUser, 
  FaTag, 
  FaHeart,
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaEye,
  FaSearch,
  FaFilter,
  FaFire,
  FaBell
} from 'react-icons/fa'

export default function News() {
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const itemsPerPage = 9
  
  // Ref for the grid container
  const gridRef = useRef<HTMLDivElement>(null)
  
  // Full News Collection
  const allNews = generateNews()
  
  // Filter news
  const filteredNews = allNews.filter(news => {
    const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          news.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          news.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || news.category === selectedCategory
    return matchesSearch && matchesCategory
  })
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentNews = filteredNews.slice(startIndex, endIndex)

  // Get unique categories
  const categories = ['All', ...new Set(allNews.map(news => news.category))]

  // Page navigation
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
    if (gridRef.current) {
      const yOffset = -160
      const y = gridRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }, [currentPage])

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedCategory])

  // Get featured news (first item)
  const featuredNews = filteredNews.length > 0 ? filteredNews[0] : null
  const restNews = filteredNews.slice(1)

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
                      <FaNewspaper className="text-[#D4AF37] text-xl" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                      <span className="text-white">News</span>
                      <span className="text-[#D4AF37]"> Updates</span>
                    </h1>
                    <p className="text-gray-400 text-xs hidden sm:block">
                      Latest updates and announcements from Markaz-e-Durood
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                  <FaBell className="text-[#D4AF37] text-xs" />
                  <span className="text-gray-300 text-xs font-medium">{allNews.length} Updates</span>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                  <FaFire className="text-[#D4AF37] text-xs" />
                  <span className="text-gray-300 text-xs font-medium">Trending</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================
            SEARCH & FILTER
            ============================================ */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search news..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#112c1b]/80 border border-[#D4AF37]/20 rounded-xl focus:border-[#D4AF37] outline-none text-white transition"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2.5 bg-[#112c1b]/80 border border-[#D4AF37]/20 rounded-xl focus:border-[#D4AF37] outline-none text-white transition"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* ============================================
            FEATURED NEWS (First Item)
            ============================================ */}
        {featuredNews && (
          <div className="mb-8 group">
            <div className="relative bg-gradient-to-r from-[#1a3d2a]/90 via-[#1a4d2e]/80 to-[#112c1b]/90 backdrop-blur-2xl border border-[#D4AF37]/20 hover:border-[#D4AF37]/40 rounded-2xl p-6 transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-[#D4AF37]/10 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent rounded-t-2xl pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row items-start gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <span className="text-[10px] px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] font-medium">
                      {featuredNews.category}
                    </span>
                    <span className="text-[10px] px-3 py-1 rounded-full bg-red-500/20 text-red-400 font-medium flex items-center gap-1">
                      <FaFire className="text-[10px]" /> Featured
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-[#D4AF37] transition-colors">
                    {featuredNews.title}
                  </h2>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    {featuredNews.excerpt}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <FaCalendar className="text-[#D4AF37] text-[10px]" />
                      {featuredNews.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaUser className="text-[#D4AF37] text-[10px]" />
                      {featuredNews.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaEye className="text-[#D4AF37] text-[10px]" />
                      {featuredNews.views}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <button className="bg-[#D4AF37] hover:bg-[#c9a030] text-green-950 font-semibold text-sm px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/40">
                    <FaNewspaper className="text-xs" />
                    Read Full Story
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================
            NEWS GRID
            ============================================ */}
        <div 
          ref={gridRef}
          id="news-grid" 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 scroll-mt-40"
        >
          {currentNews.length === 0 ? (
            <div className="col-span-full bg-[#112c1b]/80 border border-[#D4AF37]/20 rounded-xl p-12 text-center">
              <FaNewspaper className="text-5xl text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No news found matching your search.</p>
            </div>
          ) : (
            restNews.map((news, index) => (
              <div 
                key={index} 
                className="group relative transition-all duration-500 hover:-translate-y-2"
              >
                <div className="absolute -inset-2 bg-gradient-to-b from-[#D4AF37]/10 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                <div className="relative bg-gradient-to-br from-[#1a3d2a]/90 via-[#1a4d2e]/80 to-[#112c1b]/90 backdrop-blur-2xl border border-[#D4AF37]/20 hover:border-[#D4AF37]/40 rounded-xl p-5 transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-[#D4AF37]/10 overflow-hidden">
                  
                  <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent rounded-t-xl pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-[#D4AF37]/5 to-transparent rounded-b-xl pointer-events-none"></div>

                  <div className="absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b from-[#D4AF37] via-[#D4AF37]/50 to-transparent rounded-l-xl"></div>

                  <div className="relative z-10">
                    
                    {/* Category Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] font-medium">
                        {news.category}
                      </span>
                      <span className="text-[10px] font-mono font-medium text-[#D4AF37]/20">
                        {String(startIndex + index + 1).padStart(2, '0')}
                      </span>
                    </div>

                    {/* Icon */}
                    <div className="mb-3">
                      <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20 group-hover:border-[#D4AF37]/40 transition-all">
                        <FaNewspaper className="text-[#D4AF37] text-xl group-hover:scale-110 transition-transform" />
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#D4AF37] transition-colors line-clamp-2">
                      {news.title}
                    </h3>

                    <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
                      {news.excerpt}
                    </p>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-4 pb-4 border-b border-[#D4AF37]/10">
                      <span className="flex items-center gap-1">
                        <FaCalendar className="text-[#D4AF37] text-[10px]" />
                        {news.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaUser className="text-[#D4AF37] text-[10px]" />
                        {news.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaEye className="text-[#D4AF37] text-[10px]" />
                        {news.views}
                      </span>
                    </div>

                    {/* Read More Button */}
                    <button className="w-full bg-[#D4AF37] hover:bg-[#c9a030] text-green-950 font-semibold text-sm py-2 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/40">
                      <FaNewspaper className="text-xs" />
                      Read More
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ============================================
            PAGINATION
            ============================================ */}
        {totalPages > 1 && (
          <div className="mt-10 flex flex-col items-center gap-3">
            <p className="text-gray-500 text-xs">
              Showing <span className="text-[#D4AF37] font-semibold">{startIndex + 1}</span> to{' '}
              <span className="text-[#D4AF37] font-semibold">
                {Math.min(endIndex, filteredNews.length)}
              </span>{' '}
              of <span className="text-[#D4AF37] font-semibold">{filteredNews.length}</span> News
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
            <FaNewspaper className="inline mr-1.5 text-[#D4AF37]/30 text-[10px]" />
            Stay updated with the latest news and announcements
          </p>
        </div>

      </div>
    </div>
  )
}

// ============================================
// NEWS DATA - ADD NEW NEWS HERE
// ============================================
function generateNews() {
  const news = [
    {
      title: 'Annual Durood Campaign Launched',
      excerpt: 'Join our annual campaign to send 1 billion Durood Shareef during Ramadan. This is our biggest campaign yet, with participants from over 50 countries.',
      date: 'Dec 25, 2024',
      author: 'Admin',
      category: 'Announcement',
      views: '2.5K'
    },
    {
      title: 'New Online Classes Registration Open',
      excerpt: 'Registration for Spring 2025 online classes is now open for all students. Courses include Arabic, Quran, and Islamic Studies.',
      date: 'Dec 20, 2024',
      author: 'Admin',
      category: 'Education',
      views: '1.8K'
    },
    {
      title: 'Naat Competition Winners Announced',
      excerpt: 'Congratulations to all winners of the annual Naat competition 2024. Over 500 participants from 30 countries took part.',
      date: 'Dec 15, 2024',
      author: 'Admin',
      category: 'Events',
      views: '3.2K'
    },
    {
      title: 'New Audio Library Launched',
      excerpt: 'We are excited to announce the launch of our new Audio Library featuring over 500 recitations of Durood and Naat.',
      date: 'Dec 10, 2024',
      author: 'Admin',
      category: 'Resources',
      views: '2.1K'
    },
    {
      title: 'Ramadan Campaign 2025',
      excerpt: 'Prepare for Ramadan 2025 with our special campaign. Get ready to maximize your blessings during the holy month.',
      date: 'Dec 5, 2024',
      author: 'Admin',
      category: 'Campaign',
      views: '1.5K'
    },
    {
      title: 'New Website Features',
      excerpt: 'Explore the new features on our website including live Durood counter, audio library, and interactive Q&A section.',
      date: 'Dec 1, 2024',
      author: 'Admin',
      category: 'Updates',
      views: '2.9K'
    },
    {
      title: 'International Durood Conference',
      excerpt: 'Join us for the International Durood Conference with scholars from around the world discussing the virtues of Durood.',
      date: 'Nov 25, 2024',
      author: 'Admin',
      category: 'Events',
      views: '1.9K'
    },
    {
      title: 'New Books Added to Library',
      excerpt: 'We have added 50 new Islamic books to our digital library. Download and read them for free.',
      date: 'Nov 20, 2024',
      author: 'Admin',
      category: 'Resources',
      views: '2.3K'
    },
    {
      title: 'Global Durood Campaign Update',
      excerpt: 'Our global campaign has reached 50 countries. Join us in spreading blessings worldwide.',
      date: 'Nov 15, 2024',
      author: 'Admin',
      category: 'Campaign',
      views: '1.7K'
    },
    {
      title: 'New Online Classes Schedule',
      excerpt: 'Check out the new schedule for online classes starting January 2025. Register now to secure your spot.',
      date: 'Nov 10, 2024',
      author: 'Admin',
      category: 'Education',
      views: '4.1K'
    },
    {
      title: 'Community Engagement Program',
      excerpt: 'Join our community engagement program to help spread the message of Durood Shareef in your local area.',
      date: 'Nov 5, 2024',
      author: 'Admin',
      category: 'Community',
      views: '1.3K'
    },
    {
      title: 'Volunteer Opportunities',
      excerpt: 'We are looking for volunteers to help with our various programs. Join our team and make a difference.',
      date: 'Nov 1, 2024',
      author: 'Admin',
      category: 'Community',
      views: '2.6K'
    }
  ]

  return news
}