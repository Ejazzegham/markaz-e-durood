'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { 
  FaBlog, 
  FaArrowLeft, 
  FaCalendar, 
  FaUser, 
  FaTag, 
  FaHeart,
  FaChevronLeft,
  FaChevronRight,
  FaBookOpen,
  FaClock,
  FaEye,
  FaSearch,
  FaSpinner
} from 'react-icons/fa'

export default function Blog() {
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const itemsPerPage = 9
  
  // Ref for the grid container
  const gridRef = useRef<HTMLDivElement>(null)
  
  // Full Blog Collection — loaded from the admin panel
  const [allPosts, setAllPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/content/blog')
      .then((res) => res.json())
      .then((data) => {
        const items = (data.items || []).map((p: any) => ({
          ...p,
          date: new Date(p.publishedAt || p.createdAt).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
          }),
        }))
        setAllPosts(items)
      })
      .finally(() => setLoading(false))
  }, [])
  
  // Filter posts
  const filteredPosts = allPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (post.excerpt || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPosts = filteredPosts.slice(startIndex, endIndex)

  // Get unique categories
  const categories = ['All', ...new Set(allPosts.map(post => post.category))]

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
                      <FaBlog className="text-gold-500 text-xl" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                      <span className="text-white">Articles &</span>
                      <span className="text-gold-500"> Insights</span>
                    </h1>
                    <p className="text-gray-400 text-xs hidden sm:block">
                      Explore inspiring articles, research and Islamic knowledge
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gold-500/10 border border-gold-500/20">
                  <FaBookOpen className="text-gold-500 text-xs" />
                  <span className="text-gray-300 text-xs font-medium">{allPosts.length} Articles</span>
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
            SEARCH & FILTER
            ============================================ */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-2.5 bg-green-850/80 border border-gold-500/20 rounded-xl focus:border-gold-500 outline-none text-white transition"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2.5 bg-green-850/80 border border-gold-500/20 rounded-xl focus:border-gold-500 outline-none text-white transition"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* ============================================
            BLOG POSTS GRID
            ============================================ */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-500 text-sm">
            <FaSpinner className="animate-spin mr-2" /> Loading articles...
          </div>
        ) : (
        <div 
          ref={gridRef}
          id="blog-grid" 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 scroll-mt-40"
        >
          {currentPosts.length === 0 ? (
            <div className="col-span-full bg-green-850/80 border border-gold-500/20 rounded-xl p-12 text-center">
              <FaBlog className="text-5xl text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">{allPosts.length === 0 ? 'No articles have been published yet. Check back soon!' : 'No articles found matching your search.'}</p>
            </div>
          ) : (
            currentPosts.map((post, index) => (
              <div 
                key={index} 
                className="group relative transition-all duration-500 hover:-translate-y-2"
              >
                <div className="absolute -inset-2 bg-gradient-to-b from-gold-500/10 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                <div className="relative bg-gradient-to-br from-green-825/90 via-green-900/80 to-green-850/90 backdrop-blur-2xl border border-gold-500/20 hover:border-gold-500/40 rounded-xl p-6 transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-gold-500/10 overflow-hidden">
                  
                  <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent rounded-t-xl pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-gold-500/5 to-transparent rounded-b-xl pointer-events-none"></div>

                  <div className="absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b from-gold-500 via-gold-500/50 to-transparent rounded-l-xl"></div>

                  <div className="relative z-10">
                    
                    {/* Category Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] px-3 py-1 rounded-full bg-gold-500/20 text-gold-500 font-medium">
                        {post.category}
                      </span>
                      <span className="text-[10px] font-mono font-medium text-gold-500/20">
                        {String(startIndex + index + 1).padStart(2, '0')}
                      </span>
                    </div>

                    {/* Icon */}
                    <div className="mb-3">
                      <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center border border-gold-500/20 group-hover:border-gold-500/40 transition-all">
                        <FaBookOpen className="text-gold-500 text-xl group-hover:scale-110 transition-transform" />
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-gold-500 transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-4 pb-4 border-b border-gold-500/10">
                      <span className="flex items-center gap-1">
                        <FaCalendar className="text-gold-500 text-[10px]" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaUser className="text-gold-500 text-[10px]" />
                        {post.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaEye className="text-gold-500 text-[10px]" />
                        {post.views}
                      </span>
                    </div>

                    {/* Read More Button */}
                    <button className="w-full bg-gold-500 hover:bg-gold-600 text-green-950 font-semibold text-sm py-2 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-gold-500/20 hover:shadow-gold-500/40">
                      <FaBookOpen className="text-xs" />
                      Read More
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        )}

        {/* Pagination */}
{totalPages > 1 && (
  <div className="mt-10 flex flex-col items-center gap-3">
    <p className="text-gray-500 text-xs">
      Showing <span className="text-gold-500 font-semibold">{startIndex + 1}</span> to{' '}
      <span className="text-gold-500 font-semibold">
        {Math.min(endIndex, filteredPosts.length)}
      </span>{' '}
      of <span className="text-gold-500 font-semibold">{filteredPosts.length}</span> Articles
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
          let pageNum: number  // ← FIXED: Added type
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
            <FaBlog className="inline mr-1.5 text-gold-500/30 text-[10px]" />
            Gain knowledge and insights from authentic Islamic sources
          </p>
        </div>

      </div>
    </div>
  )
}

