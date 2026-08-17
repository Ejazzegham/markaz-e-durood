"use client";
import Link from 'next/link'
import Image from 'next/image'
import { 
  FaHeart, 
  FaEnvelope, 
  FaFacebook, 
  FaYoutube, 
  FaInstagram,
  FaPhone,
  FaArrowUp,
  FaGlobe,
  FaMicrophone,
  FaHeadphones,
  FaVideo,
  FaBlog,
  FaQuestionCircle
} from 'react-icons/fa'
import { FaSquareXTwitter } from 'react-icons/fa6'
import { GiBookCover } from 'react-icons/gi'
import { useState, useEffect } from 'react'

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-gradient-to-b from-green-900 to-green-950 text-white relative">
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 bg-gold-500 hover:bg-gold-600 text-green-900 w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110"
          aria-label="Scroll to top"
        >
          <FaArrowUp className="text-xl" />
        </button>
      )}

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-6 sm:pb-8">
       {/* Top Section with Logo */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 sm:gap-8 md:gap-10 lg:gap-12">
          {/* About Section with Logo */}
          <div className="col-span-2 md:col-span-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 sm:gap-4 mb-4">
              {/* Logo - No Box */}
              <img 
                src="/logo.png" 
                alt="Markaz-e-Durood" 
                className="w-12 h-12 sm:w-16 sm:h-16 object-contain flex-shrink-0"
              />
              <div>
                <h3 className="text-lg sm:text-2xl font-bold text-white tracking-wide">
                  MARKAZ E DUROOD
                </h3>
              
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs sm:max-w-sm mx-auto md:mx-0">
              A platform dedicated to learning, reciting and spreading the blessings of Durood Shareef worldwide.
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center justify-center md:justify-start gap-3 mt-4">
              <a 
                href="https://www.facebook.com/sultanfiazulhassan?mibextid=LQQJ4d" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-gold-500/20 text-gray-300 hover:text-gold-400 flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/5"
                aria-label="Facebook"
              >
                <FaFacebook className="text-sm" />
              </a>
              <a 
                href="https://x.com/haqbahu?t=tLwATs-7Bk9pAF4__IJgTw&s=09" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-gold-500/20 text-gray-300 hover:text-gold-400 flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/5"
                aria-label="X (Twitter)"
              >
                <FaSquareXTwitter className="text-sm" />
              </a>
              <a 
                href="https://www.youtube.com/@SultanFiazulHassan-Qadri" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-gold-500/20 text-gray-300 hover:text-gold-400 flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/5"
                aria-label="YouTube"
              >
                <FaYoutube className="text-sm" />
              </a>
              <a 
                href="https://www.instagram.com/sultanfiazulhassan?igsh=MWtndGNwNjVpYWRoNw%3D%3D" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-gold-500/20 text-gray-300 hover:text-gold-400 flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/5"
                aria-label="Instagram"
              >
                <FaInstagram className="text-sm" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-5 relative">
              QUICK LINKS
              <span className="absolute left-0 bottom-0 w-10 h-0.5 bg-gold-500 mt-2"></span>
            </h4>
            <ul className="space-y-2.5">
              {[
                { name: 'Home', link: '/' },
                { name: 'About Us', link: '/about' },
                { name: 'Durood Shareef', link: '/resources/durood' },
                { name: 'Durood Count', link: '/durood-count' },
                { name: 'News', link: '/news' },
                { name: 'Gallery', link: '/gallery' },
                { name: 'Contact Us', link: '/contact' }
              ].map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.link} 
                    className="text-gray-400 hover:text-gold-400 transition-all duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-gold-500/50 rounded-full group-hover:bg-gold-400 transition-colors"></span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-bold text-white mb-5 relative">
              RESOURCES
              <span className="absolute left-0 bottom-0 w-10 h-0.5 bg-gold-500 mt-2"></span>
            </h4>
            <ul className="space-y-2.5">
              {[
                { name: 'Naat Shareef', link: '/resources/naat', icon: <FaMicrophone className="text-red-400" /> },
                { name: 'Audio Library', link: '/resources/audio', icon: <FaHeadphones className="text-green-400" /> },
                { name: 'Books & PDFs', link: '/resources/books', icon: <GiBookCover className="text-gold-400" /> },
                { name: 'Bayan', link: '/resources/bayan', icon: <FaVideo className="text-purple-400" /> },
                { name: 'Video Library', link: '/resources/videos', icon: <FaVideo className="text-red-400" /> },
                { name: 'Articles & Insights', link: '/blog', icon: <FaBlog className="text-blue-400" /> },
                { name: 'Ask & Learn', link: '/resources/ask', icon: <FaQuestionCircle className="text-orange-400" /> }
              ].map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.link} 
                    className="text-gray-400 hover:text-gold-400 transition-all duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="text-xs">{item.icon}</span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-lg font-bold text-white mb-5 relative">
              CONTACT INFO
              <span className="absolute left-0 bottom-0 w-10 h-0.5 bg-gold-500 mt-2"></span>
            </h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 group">
                <div className="w-9 h-9 rounded-lg bg-gold-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-gold-500/20 transition-colors">
                  <FaEnvelope className="text-gold-400 text-sm" />
                </div>
                <a href="mailto:markaz.e.durood@gmail.com" className="text-gray-300 hover:text-gold-400 transition-colors text-sm">
                  markaz.e.durood@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="w-9 h-9 rounded-lg bg-gold-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-gold-500/20 transition-colors">
                  <FaPhone className="text-gold-400 text-sm" />
                </div>
                <a href="tel:+923008162244" className="text-gray-300 hover:text-gold-400 transition-colors text-sm">
                  0300-8162244
                </a>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="w-9 h-9 rounded-lg bg-gold-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-gold-500/20 transition-colors">
                  <FaGlobe className="text-gold-400 text-sm" />
                </div>
                <a href="https://www.markaz-e-durood.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-gold-400 transition-colors text-sm">
                  www.markaz-e-durood.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 mt-10 sm:mt-12 pt-6 sm:pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-4">
            <p className="text-gray-500 text-xs sm:text-sm text-center md:text-left order-1">
              © {new Date().getFullYear()} <span className="text-gold-400 font-semibold">Markaz E Durood</span>. All rights reserved.
            </p>
            <p className="text-gray-600 text-xs flex items-center gap-1 text-center order-2">
              Made with <FaHeart className="text-red-500 text-xs animate-pulse flex-shrink-0" /> for the love of Prophet ﷺ
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-white/5 text-center">
            <a
              href="https://faah-technology.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gold-400 text-xs transition-colors"
            >
              Powered by <span className="font-semibold">FAAH Technology</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
