'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { FaHeadphones, FaArrowLeft, FaMusic, FaHeart } from 'react-icons/fa'
import YoutubeStyleTheater, { PlayableItem } from '@/components/resources/YoutubeStyleTheater'
import AudioTheater from '@/components/resources/AudioTheater'

function getYoutubeId(url: string): string {
  const match = (url || '').match(/(?:v=|youtu\.be\/)([\w-]{11})/)
  return match ? match[1] : url
}

export default function AudioLibrary() {
  const [allAudio, setAllAudio] = useState<PlayableItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/content/audio')
      .then((res) => res.json())
      .then((data) => {
        const items: PlayableItem[] = (data.items || []).map((a: any) => ({
          id: a.id,
          title: a.title,
          subtitle: a.reciter,
          description: a.description,
          duration: a.duration,
          youtubeId: getYoutubeId(a.url),
        }))
        setAllAudio(items)
      })
      .finally(() => setLoading(false))
  }, [])

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
      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ============================================
            PREMIUM TITLE BAR
            ============================================ */}
        <div className="relative mb-8">
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
                      <FaHeadphones className="text-gold-500 text-xl" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                      <span className="text-white">Audio</span>
                      <span className="text-gold-500"> Library</span>
                    </h1>
                    <p className="text-gray-400 text-xs hidden sm:block">
                      Listen to beautiful recitations of Naat & Durood anytime
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gold-500/10 border border-gold-500/20">
                  <FaHeadphones className="text-gold-500 text-xs" />
                  <span className="text-gray-300 text-xs font-medium">{allAudio.length} Tracks</span>
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
            YOUTUBE-STYLE THEATER: PLAYER + UP NEXT LIST
            ============================================ */}
        <AudioTheater
          items={allAudio}
          loading={loading}
          emptyMessage="No audio has been added yet. Check back soon!"
          kindLabel="Audio"
          subtitleFieldLabel="Reciter"
          accentIcon={<FaHeadphones className="inline text-gold-500 text-xs" />}
        />

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
            <FaMusic className="inline mr-1.5 text-gold-500/30 text-[10px]" />
            Listen to the blessings of Naat and Durood anytime, anywhere
          </p>
        </div>

      </div>
    </div>
  )
}
