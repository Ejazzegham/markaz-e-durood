'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { 
  FaVideo, 
  FaPlay, 
  FaArrowLeft, 
  FaClock, 
  FaUser, 
  FaHeadphones, 
  FaStar, 
  FaMusic,
  FaChevronLeft,
  FaChevronRight,
  FaHeart,
  FaYoutube,
  FaMicrophone
} from 'react-icons/fa'

export default function Bayan() {
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12
  
  // Ref for the grid container
  const gridRef = useRef<HTMLDivElement>(null)
  
  // Full Bayan Collection with YOUR LINKS
  const allBayan = generateBayanCollection()
  
  // Calculate pagination
  const totalPages = Math.ceil(allBayan.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentBayan = allBayan.slice(startIndex, endIndex)

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
    if (gridRef.current) {
      const yOffset = -160
      const y = gridRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }, [currentPage])

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
                      <FaVideo className="text-[#D4AF37] text-xl" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                      <span className="text-white">Bayan</span>
                      <span className="text-[#D4AF37]"> Library</span>
                    </h1>
                    <p className="text-gray-400 text-xs hidden sm:block">
                      Watch Spiritual, Heart-touching and Life Changing Bayan
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                  <FaMicrophone className="text-[#D4AF37] text-xs" />
                  <span className="text-gray-300 text-xs font-medium">{allBayan.length} Bayan</span>
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
            BAYAN CARDS GRID
            ============================================ */}
        <div 
          ref={gridRef}
          id="bayan-grid" 
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 scroll-mt-40"
        >
          {currentBayan.map((bayan, index) => (
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
                  
                  {/* ============================================
                      YOUTUBE PLAYER ON TOP
                      ============================================ */}
                  {bayan.youtubeId && (
                    <div className="mb-2 rounded-lg overflow-hidden aspect-video">
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${bayan.youtubeId}`}
                        title={bayan.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </div>
                  )}

                  <h3 className="text-sm font-bold text-white mb-0.5 group-hover:text-[#D4AF37] transition-colors line-clamp-1">
                    {bayan.title}
                  </h3>

                  <p className="text-gray-400 text-[11px] flex items-center gap-1.5 mb-1.5">
                    <FaUser className="text-[#D4AF37] text-[10px]" />
                    {bayan.speaker}
                  </p>

                  <p className="text-gray-500 text-[10px] leading-relaxed mb-2 line-clamp-2">
                    {bayan.description}
                  </p>

                  <div className="flex items-center gap-3 text-[10px] text-gray-500 mb-2 pb-2 border-b border-[#D4AF37]/10">
                    <span className="flex items-center gap-1">
                      <FaClock className="text-[#D4AF37] text-[10px]" />
                      {bayan.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaYoutube className="text-red-500 text-[10px]" />
                    </span>
                  </div>

                  {/* Watch on YouTube Button */}
                  {bayan.externalLink && (
                    <button 
                      onClick={() => window.open(bayan.externalLink, '_blank')}
                      className="w-full bg-red-600/20 hover:bg-red-600/30 text-white font-semibold text-xs py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 mt-1 border border-red-500/30"
                    >
                      <FaYoutube className="text-red-500" />
                      Watch on YouTube
                    </button>
                  )}
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
                {Math.min(endIndex, allBayan.length)}
              </span>{' '}
              of <span className="text-[#D4AF37] font-semibold">{allBayan.length}</span> Bayan
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
            <FaMusic className="inline mr-1.5 text-[#D4AF37]/30 text-[10px]" />
            Listen to spiritual Bayan and transform your heart
          </p>
        </div>

      </div>
    </div>
  )
}

// ============================================
// BAYAN DATA - YOUR 18 LINKS
// ============================================
function generateBayanCollection() {
  const bayanData = [
    {
      title: 'Sunni Conference Mian Channu Speech',
      speaker: 'Sultan Fiaz ul Hassan Qadri',
      description: 'Powerful speech at Sunni Conference addressing important Islamic issues',
      duration: '25:00',
      youtubeId: 'bMTbtUyXVJI',
      externalLink: 'https://www.youtube.com/watch?v=bMTbtUyXVJI'
    },
    {
      title: 'Why Do We Believe in Ali?',
      speaker: 'Sultan Fiaz ul Hassan Qadri',
      description: 'Understanding the significance of Hazrat Ali (RA) in Islamic faith',
      duration: '18:30',
      youtubeId: 'XPzCPbuJAxo',
      externalLink: 'https://www.youtube.com/watch?v=XPzCPbuJAxo'
    },
    {
      title: 'Which Is The Straight Path?',
      speaker: 'Sultan Fiaz ul Hassan Qadri',
      description: 'Guidance on finding and following the straight path in Islam',
      duration: '22:15',
      youtubeId: '1ezZJmIUOlc',
      externalLink: 'https://www.youtube.com/watch?v=1ezZJmIUOlc'
    },
    {
      title: 'How was Muhammad (PBUH)?',
      speaker: 'Sultan Fiaz ul Hassan Qadri',
      description: 'Beautiful description of the character and life of Prophet Muhammad ﷺ',
      duration: '20:45',
      youtubeId: 'azWiuc_gnNE',
      externalLink: 'https://www.youtube.com/watch?v=azWiuc_gnNE'
    },
    {
      title: 'Powerful Islamic Bayan',
      speaker: 'Sultan Fiaz ul Hassan Qadri',
      description: 'Heart-touching spiritual discourse on Islamic teachings',
      duration: '30:00',
      youtubeId: 'P6JruwcTR6M',
      externalLink: 'https://www.youtube.com/watch?v=P6JruwcTR6M'
    },
    {
      title: 'Spiritual Bayan on Sufism',
      speaker: 'Sultan Fiaz ul Hassan Qadri',
      description: 'Deep insights into Sufi teachings and spiritual purification',
      duration: '28:30',
      youtubeId: '9nGozy7dJu4',
      externalLink: 'https://www.youtube.com/watch?v=9nGozy7dJu4'
    },
    {
      title: 'The Love of Prophet ﷺ',
      speaker: 'Sultan Fiaz ul Hassan Qadri',
      description: 'Expressing love for the Prophet and following his teachings',
      duration: '19:45',
      youtubeId: 'nlQGVHWbYTs',
      externalLink: 'https://www.youtube.com/watch?v=nlQGVHWbYTs'
    },
    {
      title: 'Islamic Reminders for Youth',
      speaker: 'Sultan Fiaz ul Hassan Qadri',
      description: 'Important reminders and guidance for the Muslim youth',
      duration: '24:00',
      youtubeId: '6zqXlUSwvD0',
      externalLink: 'https://www.youtube.com/watch?v=6zqXlUSwvD0'
    },
    {
      title: 'The Path of the Righteous',
      speaker: 'Sultan Fiaz ul Hassan Qadri',
      description: 'Following the footsteps of the righteous predecessors',
      duration: '21:30',
      youtubeId: 'ngZwZwEJakA',
      externalLink: 'https://www.youtube.com/watch?v=ngZwZwEJakA'
    },
    {
      title: 'Understanding Tawheed',
      speaker: 'Sultan Fiaz ul Hassan Qadri',
      description: 'Deep dive into the concept of Oneness of Allah',
      duration: '26:15',
      youtubeId: 'ppQhJ7OQk4M',
      externalLink: 'https://www.youtube.com/watch?v=ppQhJ7OQk4M'
    },
    {
      title: 'The Life of the Prophet',
      speaker: 'Sultan Fiaz ul Hassan Qadri',
      description: 'Seerah and life lessons from the Prophet Muhammad ﷺ',
      duration: '32:00',
      youtubeId: '7K3y_lwXrMk',
      externalLink: 'https://www.youtube.com/watch?v=7K3y_lwXrMk'
    },
    {
      title: 'Spiritual Healing',
      speaker: 'Sultan Fiaz ul Hassan Qadri',
      description: 'Healing the heart through Islamic spirituality',
      duration: '23:30',
      youtubeId: 'L5XWvEOCQM0',
      externalLink: 'https://www.youtube.com/watch?v=L5XWvEOCQM0'
    },
    {
      title: 'The Beauty of Islam',
      speaker: 'Sultan Fiaz ul Hassan Qadri',
      description: 'Exploring the beauty and perfection of the Islamic faith',
      duration: '27:45',
      youtubeId: 'zv4ZJ0oisSs',
      externalLink: 'https://www.youtube.com/watch?v=zv4ZJ0oisSs'
    },
    {
      title: 'Sufi Teachings',
      speaker: 'Sultan Fiaz ul Hassan Qadri',
      description: 'Insights into Sufi teachings and spiritual development',
      duration: '29:00',
      youtubeId: 'eCfwdBqSrPk',
      externalLink: 'https://www.youtube.com/watch?v=eCfwdBqSrPk'
    },
    {
      title: 'The Power of Durood',
      speaker: 'Sultan Fiaz ul Hassan Qadri',
      description: 'Understanding the blessings and power of sending Durood',
      duration: '18:30',
      youtubeId: '1Xc3fciSh9I',
      externalLink: 'https://www.youtube.com/watch?v=1Xc3fciSh9I'
    },
    {
      title: 'Islamic Ethics and Morals',
      speaker: 'Sultan Fiaz ul Hassan Qadri',
      description: 'Islamic teachings on ethics, morals and character building',
      duration: '25:20',
      youtubeId: 'OkmKrT72wxQ',
      externalLink: 'https://www.youtube.com/watch?v=OkmKrT72wxQ'
    },
    {
      title: 'The Day of Judgement',
      speaker: 'Sultan Fiaz ul Hassan Qadri',
      description: 'Reminders about the Day of Judgement and preparation for it',
      duration: '31:00',
      youtubeId: 'fslHHXOKR4Y',
      externalLink: 'https://www.youtube.com/watch?v=fslHHXOKR4Y'
    },
    {
      title: 'Spiritual Journey to Allah',
      speaker: 'Sultan Fiaz ul Hassan Qadri',
      description: 'The journey of the soul towards Allah and spiritual development',
      duration: '26:45',
      youtubeId: 'gS9XYpKrKZQ',
      externalLink: 'https://www.youtube.com/watch?v=gS9XYpKrKZQ'
    }
  ]

  return bayanData
}