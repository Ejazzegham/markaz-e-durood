'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { FaMosque, FaHeart } from 'react-icons/fa'

interface SplashScreenProps {
  children: React.ReactNode
}

export default function SplashScreen({ children }: SplashScreenProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Show splash screen for 2.5 seconds
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-green-900 via-green-800 to-green-700 flex flex-col items-center justify-center">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.05]">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(212,175,55,0.3) 60px, rgba(212,175,55,0.3) 61px),
              repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(212,175,55,0.3) 60px, rgba(212,175,55,0.3) 61px)
            `
          }} />
        </div>

        {/* Decorative Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.1),transparent_60%)]"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center animate-fadeIn">
          {/* Logo */}
          <div className="relative w-32 h-32 md:w-40 md:h-40 mb-6 animate-pulse-slow">
            <Image
              src="/logo.png"
              alt="Markaz-e-Durood"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Brand Name */}
          <h1 className="text-2xl md:text-4xl font-bold text-white text-center mb-2 font-['Playfair_Display']">
            Markaz-e-<span className="text-[#D4AF37]">Durood</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm md:text-base text-green-300 text-center mb-6">
            Spreading Blessings of Durood Shareef
          </p>

          {/* Loading Bar */}
          <div className="w-48 md:w-64 h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-[#D4AF37] rounded-full animate-loading-bar"></div>
          </div>

          {/* Heart Icon */}
          <FaHeart className="text-[#D4AF37] text-sm mt-4 animate-pulse" />
        </div>
      </div>
    )
  }

  return <>{children}</>
}