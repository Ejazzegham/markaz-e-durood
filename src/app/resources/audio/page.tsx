'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { 
  FaHeadphones, 
  FaPlay, 
  FaPause,
  FaArrowLeft, 
  FaClock, 
  FaUser, 
  FaMusic,
  FaChevronLeft,
  FaChevronRight,
  FaHeart,
  FaYoutube,
  FaVolumeUp,
  FaVolumeMute,
  FaStop
} from 'react-icons/fa'

export default function AudioLibrary() {
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  
  // Audio Player State
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  
  // Ref for the list container
  const listRef = useRef<HTMLDivElement>(null)
  
  // Full Audio Collection with YouTube links
  const allAudio = generateAudioCollection()
  
  // Calculate pagination
  const totalPages = Math.ceil(allAudio.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentAudio = allAudio.slice(startIndex, endIndex)

  // Page navigation with proper offset for fixed header
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      
      setTimeout(() => {
        if (listRef.current) {
          const yOffset = -160
          const y = listRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset
          window.scrollTo({ top: y, behavior: 'smooth' })
        }
      }, 100)
    }
  }

  useEffect(() => {
    if (listRef.current) {
      const yOffset = -160
      const y = listRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }, [currentPage])

  // Toggle play - Opens YouTube in a small popup with audio
  const togglePlay = (audio: any) => {
    if (playingId === audio.id) {
      setPlayingId(null)
      setIsPlaying(false)
    } else {
      setPlayingId(audio.id)
      setIsPlaying(true)
      // Open YouTube video in a new window (small player)
      window.open(
        `https://www.youtube.com/watch?v=${audio.youtubeId}`,
        '_blank',
        'width=400,height=200,resizable=yes'
      )
    }
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
                      <FaHeadphones className="text-[#D4AF37] text-xl" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                      <span className="text-white">Audio</span>
                      <span className="text-[#D4AF37]"> Library</span>
                    </h1>
                    <p className="text-gray-400 text-xs hidden sm:block">
                      Listen to beautiful recitations of Naat & Durood anytime
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                  <FaMusic className="text-[#D4AF37] text-xs" />
                  <span className="text-gray-300 text-xs font-medium">{allAudio.length} Audio</span>
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
            AUDIO LIST - LIST STYLE WITH PLAYER
            ============================================ */}
        <div 
          ref={listRef}
          id="audio-list" 
          className="space-y-4 scroll-mt-40"
        >
          {currentAudio.map((audio, index) => (
            <div 
              key={audio.id} 
              className={`group relative transition-all duration-500 hover:-translate-y-1 ${
                playingId === audio.id ? 'ring-1 ring-[#D4AF37]/40' : ''
              }`}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-[#D4AF37]/10 to-transparent rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className={`relative bg-gradient-to-r from-[#1a3d2a]/90 via-[#1a4d2e]/80 to-[#112c1b]/90 backdrop-blur-2xl border ${
                playingId === audio.id ? 'border-[#D4AF37]/60' : 'border-[#D4AF37]/20 hover:border-[#D4AF37]/40'
              } rounded-xl p-4 transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-[#D4AF37]/10 overflow-hidden`}>
                
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent rounded-t-xl pointer-events-none"></div>

                <div className="absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b from-[#D4AF37] via-[#D4AF37]/50 to-transparent rounded-l-xl"></div>

                <div className="relative z-10 flex flex-col gap-3">
                  {/* Top Row: Info + Controls */}
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    
                    {/* Index Number */}
                    <div className="w-10 h-10 flex items-center justify-center text-[#D4AF37] font-bold text-sm border border-[#D4AF37]/20 rounded-lg bg-[#D4AF37]/5 flex-shrink-0">
                      {String(startIndex + index + 1).padStart(2, '0')}
                    </div>

                    {/* Audio Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-white group-hover:text-[#D4AF37] transition-colors line-clamp-1">
                        {audio.title}
                      </h3>
                      
                      <p className="text-gray-400 text-xs flex items-center gap-2 mt-0.5">
                        <FaUser className="text-[#D4AF37] text-[10px]" />
                        {audio.reciter}
                      </p>

                      <p className="text-gray-500 text-xs leading-relaxed mt-1 line-clamp-1">
                        {audio.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <FaClock className="text-[#D4AF37]" />
                          {audio.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaYoutube className="text-red-500" />
                          Audio
                        </span>
                      </div>
                    </div>

                    {/* Play/Pause Button */}
                    <button 
                      onClick={() => togglePlay(audio)}
                      className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 min-w-[120px] ${
                        playingId === audio.id
                          ? 'bg-red-500/20 hover:bg-red-500/30 text-white border border-red-500/30'
                          : 'bg-[#D4AF37] hover:bg-[#c9a030] text-green-950 shadow-lg shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/40'
                      }`}
                    >
                      {playingId === audio.id ? (
                        <>
                          <FaStop /> Stop
                        </>
                      ) : (
                        <>
                          <FaPlay /> Listen
                        </>
                      )}
                    </button>
                  </div>

                  {/* ============================================
                      AUDIO PLAYER CONTROLS (Visible when playing)
                      ============================================ */}
                  {playingId === audio.id && (
                    <div className="mt-2 pt-3 border-t border-[#D4AF37]/20">
                      <div className="flex items-center gap-3">
                        {/* Now Playing Animation */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-0.5 h-6">
                            <div className="w-1 h-3 bg-[#D4AF37] rounded-full animate-[wave_0.8s_ease-in-out_infinite]"></div>
                            <div className="w-1 h-5 bg-[#D4AF37] rounded-full animate-[wave_0.6s_ease-in-out_infinite_0.2s]"></div>
                            <div className="w-1 h-4 bg-[#D4AF37] rounded-full animate-[wave_0.7s_ease-in-out_infinite_0.4s]"></div>
                            <div className="w-1 h-6 bg-[#D4AF37] rounded-full animate-[wave_0.5s_ease-in-out_infinite_0.1s]"></div>
                            <div className="w-1 h-3 bg-[#D4AF37] rounded-full animate-[wave_0.9s_ease-in-out_infinite_0.3s]"></div>
                          </div>
                          <span className="text-xs text-[#D4AF37] font-medium">
                            Now Playing
                          </span>
                        </div>

                        {/* Open YouTube Button */}
                        <button 
                          onClick={() => window.open(`https://www.youtube.com/watch?v=${audio.youtubeId}`, '_blank')}
                          className="ml-auto bg-red-600/20 hover:bg-red-600/30 text-white text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 border border-red-500/30"
                        >
                          <FaYoutube className="text-red-500" />
                          Open in YouTube
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Playing Animation Wave */}
                {playingId === audio.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#D4AF37] via-yellow-400 to-[#D4AF37] animate-pulse"></div>
                )}
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
                {Math.min(endIndex, allAudio.length)}
              </span>{' '}
              of <span className="text-[#D4AF37] font-semibold">{allAudio.length}</span> Audio
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
            <FaMusic className="inline mr-1.5 text-[#D4AF37]/30 text-[10px]" />
            Listen to the blessings of Naat and Durood anytime, anywhere
          </p>
        </div>

        {/* Add CSS animation for wave */}
        <style jsx>{`
          @keyframes wave {
            0%, 100% { transform: scaleY(0.5); }
            50% { transform: scaleY(1); }
          }
        `}</style>

      </div>
    </div>
  )
}

// ============================================
// AUDIO DATA - ADD NEW AUDIO LINKS HERE
// ============================================
function generateAudioCollection() {
  const audioData = [
    {
      id: '1',
      title: 'ALi Warga zamane te koi peer',
      reciter: 'Qari Shahid Mehmood',
      description: 'Beautiful naat praising Hazrat Ali (RA) with soulful voice',
      duration: '8:30',
      youtubeId: 'u53orMnVf9Q'
    },
    {
      id: '2',
      title: 'Unki Chokhat Ho',
      reciter: 'Qari Shahid Mehmood',
      description: 'New Naat 2022 with touching words and melodious voice',
      duration: '6:45',
      youtubeId: 'KaJUCXdIMi4'
    },
    {
      id: '3',
      title: 'Unka Mangta Houn',
      reciter: 'Qari Shahid Mehmood Qadri',
      description: 'Ramzan Naat 2023 - New Medley Kalam',
      duration: '5:20',
      youtubeId: 'GMHX3QCNUow'
    },
    {
      id: '4',
      title: 'Ghareeban Ty Yatiman Da Sahara',
      reciter: 'Alhaj Farooq Mehrvi',
      description: 'Heart-touching naat about orphans and the Prophet ﷺ',
      duration: '7:15',
      youtubeId: 'AnPxiClcPO0'
    },
    {
      id: '5',
      title: 'Gada Ban Kay Madinay Da',
      reciter: 'Qari Shahid Mehmood Qadri',
      description: 'Urdu naat with beautiful lyrics and melodious voice',
      duration: '4:50',
      youtubeId: '5SnQlZdm358'
    },
    {
      id: '6',
      title: 'Main Khwaab Ich Aqaa',
      reciter: 'Shahbaz Qamar Freedi',
      description: 'Popular naat about the Prophet ﷺ in Punjabi',
      duration: '6:20',
      youtubeId: 'KM9eAcKZlEk'
    },
    {
      id: '7',
      title: 'Jee Aya Sohnyo',
      reciter: 'Qari Shahid Mehmood',
      description: 'Beautiful naat recitation by Qari Shahid Mehmood',
      duration: '5:45',
      youtubeId: 'jWPGJDwfh9Q'
    },
    {
      id: '8',
      title: 'Main Khwaab Ich Aqaa Shahbaaz',
      reciter: 'Qari Shahid Mehmood',
      description: 'Powerful naat recitation with emotional voice',
      duration: '7:30',
      youtubeId: 'Hurzesb8dhI'
    },
    {
      id: '9',
      title: 'ALLAH Ke Naam',
      reciter: 'Qari Shahid Mehmood',
      description: 'Naat about the name of Allah - Mehfil e Naat 2017',
      duration: '4:20',
      youtubeId: 'Cr2Jr1jkuOM'
    },
    {
      id: '10',
      title: 'Ker Dy Karam Rab Sayyan',
      reciter: 'Qari Shahid Mehmood',
      description: 'Beautiful naat recitation by Qari Shahid Mehmood',
      duration: '6:10',
      youtubeId: 'kn03lDXiAAk'
    },
    {
      id: '11',
      title: 'Main Te Bhull Gaya',
      reciter: 'Qari Shahid Mehmood',
      description: 'Emotional naat about love for the Prophet ﷺ',
      duration: '5:30',
      youtubeId: '0Fal15jO3Ko'
    },
    {
      id: '12',
      title: 'Kalaam Hazrat Sultan Bahoo',
      reciter: 'Prof Abdul Rauf Rufi',
      description: 'Beautiful Kalaam of Hazrat Sultan Bahoo (RA)',
      duration: '6:00',
      youtubeId: '56-7Hs-o-co'
    }
  ]

  return audioData
}