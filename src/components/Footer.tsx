"use client";
import Link from 'next/link'
import Image from 'next/image'
import { 
  FaHeart, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaClock, 
  FaFacebook, 
  FaTwitter, 
  FaYoutube, 
  FaInstagram,
  FaPhone,
  FaArrowUp
} from 'react-icons/fa'
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
          className="fixed bottom-6 right-6 z-50 bg-yellow-500 hover:bg-yellow-600 text-green-900 w-12 h-12 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110"
          aria-label="Scroll to top"
        >
          <FaArrowUp className="text-xl" />
        </button>
      )}

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
       {/* Top Section with Logo */}
        <div className="grid md:grid-cols-4 gap-10 lg:gap-12">
          {/* About Section with Logo */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
              {/* Logo - No Box */}
              <img 
                src="/logo.png" 
                alt="Markaz-e-Durood" 
                className="w-16 h-16 object-contain"
              />
              <div>
                <h3 className="text-2xl font-bold text-white tracking-wide">
                  MARKAZ E DUROOD
                </h3>
              
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
              A platform dedicated to learning, reciting and spreading the blessings of Durood Shareef worldwide.
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center justify-center md:justify-start gap-3 mt-4">
              <a 
                href="#" 
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-yellow-500/20 text-gray-300 hover:text-yellow-400 flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/5"
                aria-label="Facebook"
              >
                <FaFacebook className="text-sm" />
              </a>
              <a 
                href="#" 
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-yellow-500/20 text-gray-300 hover:text-yellow-400 flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/5"
                aria-label="Twitter"
              >
                <FaTwitter className="text-sm" />
              </a>
              <a 
                href="#" 
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-yellow-500/20 text-gray-300 hover:text-yellow-400 flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/5"
                aria-label="YouTube"
              >
                <FaYoutube className="text-sm" />
              </a>
              <a 
                href="#" 
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-yellow-500/20 text-gray-300 hover:text-yellow-400 flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/5"
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
              <span className="absolute left-0 bottom-0 w-10 h-0.5 bg-yellow-500 mt-2"></span>
            </h4>
            <ul className="space-y-2.5">
              {[
                { name: 'Home', link: '/' },
                { name: 'About Us', link: '/about' },
                { name: 'Durood Shareef', link: '/resources/durood' },
                { name: 'Books', link: '/resources/books' },
                { name: 'Audio', link: '/resources/audio' },
                { name: 'Contact Us', link: '/contact' }
              ].map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.link} 
                    className="text-gray-400 hover:text-yellow-400 transition-all duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-yellow-500/50 rounded-full group-hover:bg-yellow-400 transition-colors"></span>
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
              <span className="absolute left-0 bottom-0 w-10 h-0.5 bg-yellow-500 mt-2"></span>
            </h4>
            <ul className="space-y-2.5">
              {[
                { name: 'Videos', link: '/resources/videos' },
                { name: 'Blog', link: '/blog' },
                { name: 'Articles', link: '/blog' },
                { name: 'Ask & Learn', link: '/resources/ask' },
                { name: 'Naat Shareef', link: '/resources/naat' },
                { name: 'Bayan', link: '/resources/bayan' }
              ].map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.link} 
                    className="text-gray-400 hover:text-yellow-400 transition-all duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-yellow-500/50 rounded-full group-hover:bg-yellow-400 transition-colors"></span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold text-white mb-5 relative">
              CONTACT INFO
              <span className="absolute left-0 bottom-0 w-10 h-0.5 bg-yellow-500 mt-2"></span>
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group">
                <div className="w-9 h-9 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-yellow-500/20 transition-colors">
                  <FaEnvelope className="text-yellow-400 text-sm" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <a href="mailto:info@markazeduood.com" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">
                    info@markazeduood.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="w-9 h-9 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-yellow-500/20 transition-colors">
                  <FaPhone className="text-yellow-400 text-sm" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <a href="tel:+923001234567" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">
                    +92 300 1234567
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="w-9 h-9 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-yellow-500/20 transition-colors">
                  <FaMapMarkerAlt className="text-yellow-400 text-sm" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <span className="text-gray-300 text-sm">Washington, USA</span>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="w-9 h-9 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-yellow-500/20 transition-colors">
                  <FaClock className="text-yellow-400 text-sm" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Work Hours</p>
                  <span className="text-gray-300 text-sm">Mon - Sun: 9:00 AM - 9:00 PM</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              © 2024 <span className="text-yellow-400 font-semibold">Markaz E Durood</span>. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-xs">
              <Link href="/privacy" className="text-gray-500 hover:text-yellow-400 transition-colors">
                Privacy Policy
              </Link>
              <span className="text-gray-600">|</span>
              <Link href="/terms" className="text-gray-500 hover:text-yellow-400 transition-colors">
                Terms & Conditions
              </Link>
              <span className="text-gray-600">|</span>
              <Link href="/faq" className="text-gray-500 hover:text-yellow-400 transition-colors">
                FAQ
              </Link>
            </div>
            <p className="text-gray-600 text-xs flex items-center gap-1">
              Made with <FaHeart className="text-red-500 text-xs animate-pulse" /> for the love of Prophet ﷺ
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}