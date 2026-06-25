'use client'

import { useState, useRef, useEffect } from 'react'
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from 'react-icons/fa'

interface AudioPlayerProps {
  src: string
  autoPlay?: boolean
  loop?: boolean
}

export default function AudioPlayer({ src, autoPlay = true, loop = true }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [isMuted, setIsMuted] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    setIsClient(true)
    
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio(src)
      audioRef.current.loop = loop
      audioRef.current.volume = volume
      
      if (autoPlay) {
        const playPromise = audioRef.current.play()
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch(() => {
              setIsPlaying(false)
              console.log('Auto-play blocked. User must interact first.')
            })
        }
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [src, loop, autoPlay])

  // Try to play on any user interaction
  useEffect(() => {
    if (!isClient) return

    const handleUserInteraction = () => {
      if (audioRef.current && !isPlaying && !audioRef.current.paused) {
        audioRef.current.play().catch(() => {})
      }
    }

    document.addEventListener('click', handleUserInteraction)
    document.addEventListener('touchstart', handleUserInteraction)

    return () => {
      document.removeEventListener('click', handleUserInteraction)
      document.removeEventListener('touchstart', handleUserInteraction)
    }
  }, [isPlaying, isClient])

  const togglePlay = () => {
    if (!audioRef.current) return
    
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const toggleMute = () => {
    if (!audioRef.current) return
    audioRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value)
    setVolume(val)
    if (audioRef.current) {
      audioRef.current.volume = val
    }
  }

  if (!isClient) return null

  return (
  <div className="fixed bottom-5 left-5 z-50">
    <div
      className="
        flex items-center gap-3
        px-3 py-2
        rounded-lg
        bg-[#0f2f1f]/85
        backdrop-blur-xl
        border border-[#D4AF37]/25
        shadow-lg
      "
    >
      <button
        onClick={togglePlay}
        className="
          w-8 h-8
          rounded-full
          bg-[#D4AF37]
          text-[#0b1d12]
          flex items-center justify-center
          hover:scale-105
          transition-all
        "
      >
        {isPlaying ? <FaPause size={10} /> : <FaPlay size={10} className="ml-[1px]" />}
      </button>

      <button
        onClick={toggleMute}
        className="
          text-[#D4AF37]
          hover:text-white
          transition-colors
        "
      >
        {isMuted ? <FaVolumeMute size={14} /> : <FaVolumeUp size={14} />}
      </button>

      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={isMuted ? 0 : volume}
        onChange={handleVolumeChange}
        className="
          w-16
          h-1
          cursor-pointer
          accent-[#D4AF37]
        "
      />
    </div>
  </div>
)
}