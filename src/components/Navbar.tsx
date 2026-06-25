'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { 
  FaBars, 
  FaTimes, 
  FaCaretDown, 
  FaBookOpen,
  FaHeadphones,
  FaVideo,
  FaFilePdf,
  FaUsers,
  FaUser,
  FaSignInAlt,
  FaUserPlus,
  FaHands,
  FaGlobe,
  FaMicrophone,
  FaHeart,
  FaQuran,
  FaHome,
  FaMosque,
  FaNewspaper,
  FaInfoCircle,
  FaEnvelope,
  FaGraduationCap,
  FaBlog,
  FaDonate,
  FaQuestionCircle
} from 'react-icons/fa'
import { GiBookCover } from 'react-icons/gi'
import { MdMenuBook, MdDashboard } from 'react-icons/md'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [classesOpen, setClassesOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [resourcesOpen, setResourcesOpen] = useState(false)
  
  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <>
      <nav className="bg-gradient-to-r from-green-900 via-green-800 to-green-900 text-white fixed w-full top-0 z-50 shadow-2xl border-b border-yellow-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
              <div className="relative w-12 h-12">
                <img 
                  src="/logo.png" 
                  alt="Markaz-e-Durood" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-xl font-bold tracking-wide hover:text-yellow-400 transition-colors">
                  Markaz-e-Durood
                </span>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center justify-center flex-1 px-4">
              <div className="flex items-center gap-1">
                <Link href="/" className="px-3 py-2 rounded-lg hover:bg-white/10 hover:text-yellow-400 transition-all duration-300 text-sm font-medium whitespace-nowrap">
                  Home
                </Link>
                
                <Link href="/masjid-e-hussain" className="px-3 py-2 rounded-lg hover:bg-white/10 hover:text-yellow-400 transition-all duration-300 text-sm font-medium whitespace-nowrap">
                  Masjid-e-Hussain
                </Link>

                {/* Resources Dropdown - Clean Order */}
                <div className="relative group">
                  <button className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-white/10 hover:text-yellow-400 transition-all duration-300 text-sm font-medium whitespace-nowrap">
                    Resources <FaCaretDown className="text-xs" />
                  </button>
                  <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="bg-green-800/95 backdrop-blur-sm rounded-xl shadow-2xl py-2 w-56 border border-yellow-500/20">
                      <Link href="/resources/naat" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors text-sm">
                        <FaMicrophone className="text-red-400" /> Naat Shareef
                      </Link>
                      <Link href="/resources/audio" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors text-sm">
                        <FaHeadphones className="text-green-400" /> Audio Library
                      </Link>
                      <Link href="/resources/books" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors text-sm">
                        <GiBookCover className="text-yellow-400" /> Books & PDFs
                      </Link>
                      <Link href="/resources/bayan" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors text-sm">
                        <FaVideo className="text-purple-400" /> Bayan
                      </Link>
                      <Link href="/blog" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors text-sm">
                        <FaBlog className="text-blue-400" /> Articles & Insights
                      </Link>
                      <Link href="/resources/ask" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors text-sm">
                        <FaQuestionCircle className="text-orange-400" /> Ask & Learn
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Online Classes Dropdown */}
                <div className="relative group">
                  <button className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-white/10 hover:text-yellow-400 transition-all duration-300 text-sm font-medium whitespace-nowrap">
                    Online Classes <FaCaretDown className="text-xs" />
                  </button>
                  <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="bg-green-800/95 backdrop-blur-sm rounded-xl shadow-2xl py-2 w-56 border border-yellow-500/20">
                      <Link href="/online-classes/arabic" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors text-sm">
                        <FaGlobe className="text-blue-400" /> Arabic Classes
                      </Link>
                      <Link href="/online-classes/urdu" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors text-sm">
                        <MdMenuBook className="text-green-400" /> Urdu Classes
                      </Link>
                      <Link href="/online-classes/bs" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors text-sm">
                        <FaBookOpen className="text-yellow-400" /> BS Classes
                      </Link>
                      <Link href="/online-classes/english-medium" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors text-sm">
                        <FaGlobe className="text-blue-400" /> English Medium
                      </Link>
                      <Link href="/online-classes/recitation" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors text-sm">
                        <FaMicrophone className="text-red-400" /> Online Recitation
                      </Link>
                      <Link href="/online-classes/naat-competition" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors text-sm">
                        <FaHeart className="text-pink-400" /> Naat Competition
                      </Link>
                    </div>
                  </div>
                </div>

                <Link href="/durood-count" className="px-3 py-2 rounded-lg hover:bg-white/10 hover:text-yellow-400 transition-all duration-300 text-sm font-medium whitespace-nowrap">
                  Durood Count
                </Link>

                <Link href="/news" className="px-3 py-2 rounded-lg hover:bg-white/10 hover:text-yellow-400 transition-all duration-300 text-sm font-medium whitespace-nowrap">
                  News
                </Link>

                <Link href="/about" className="px-3 py-2 rounded-lg hover:bg-white/10 hover:text-yellow-400 transition-all duration-300 text-sm font-medium whitespace-nowrap">
                  About
                </Link>

                <Link href="/contact" className="px-3 py-2 rounded-lg hover:bg-white/10 hover:text-yellow-400 transition-all duration-300 text-sm font-medium whitespace-nowrap">
                  Contact
                </Link>

                {/* Account Dropdown */}
                <div className="relative group">
                  <button className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-white/10 hover:text-yellow-400 transition-all duration-300 text-sm font-medium whitespace-nowrap">
                    Account <FaCaretDown className="text-xs" />
                  </button>
                  <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="bg-green-800/95 backdrop-blur-sm rounded-xl shadow-2xl py-2 w-48 border border-yellow-500/20">
                      <Link href="/account/login" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors text-sm">
                        <FaSignInAlt className="text-green-400" /> Login
                      </Link>
                      <Link href="/account/register" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors text-sm">
                        <FaUserPlus className="text-yellow-400" /> Register
                      </Link>
                      <div className="border-t border-white/10 my-1"></div>
                      <Link href="/account/submit-durood" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors text-sm">
                        <FaHands className="text-red-400" /> Submit Durood
                      </Link>
                      <Link href="/account/donate" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors text-sm">
                        <FaDonate className="text-red-400" /> Donate
                      </Link>
                      <div className="border-t border-white/10 my-1"></div>
                      <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors text-sm">
                        <MdDashboard className="text-blue-400" /> Dashboard
                      </Link>
                      <Link href="/logout" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors text-sm">
                        <FaUser className="text-red-400" /> Logout
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden relative w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/10 transition-all duration-300 group flex-shrink-0"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-5">
                <span className={`absolute left-0 w-full h-0.5 bg-white rounded-full transition-all duration-300 ${
                  isOpen ? 'top-2 rotate-45' : 'top-0'
                }`}></span>
                <span className={`absolute left-0 w-full h-0.5 bg-white rounded-full transition-all duration-300 ${
                  isOpen ? 'opacity-0' : 'top-2'
                }`}></span>
                <span className={`absolute left-0 w-full h-0.5 bg-white rounded-full transition-all duration-300 ${
                  isOpen ? 'top-2 -rotate-45' : 'top-4'
                }`}></span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* ============================================
          MOBILE MENU
          ============================================ */}
      <div 
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        style={{ top: '80px' }}
      >
        <div 
          className={`absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-500 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsOpen(false)}
        ></div>

        <div 
          className={`absolute right-0 top-0 h-full w-full max-w-sm bg-gradient-to-b from-green-900 to-green-800 shadow-2xl transition-all duration-500 ease-out overflow-y-auto ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Header */}
          <div className="relative px-6 py-8 border-b border-white/10">
            <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-500/5 rounded-full blur-3xl"></div>
            <div className="relative flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                <img 
                  src="/logo.png" 
                  alt="Markaz-e-Durood" 
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Markaz-e-Durood</h3>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="px-4 py-6 space-y-1">
            <Link href="/" className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-white/10 transition-all duration-300 group" onClick={() => setIsOpen(false)}>
              <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FaHome className="text-yellow-400 text-lg" />
              </div>
              <span className="text-white font-medium">Home</span>
            </Link>

            <Link href="/masjid-e-hussain" className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-white/10 transition-all duration-300 group" onClick={() => setIsOpen(false)}>
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FaMosque className="text-green-400 text-lg" />
              </div>
              <span className="text-white font-medium">Masjid-e-Hussain</span>
            </Link>

            {/* Resources - Collapsible */}
            <div>
              <button 
                onClick={() => setResourcesOpen(!resourcesOpen)}
                className="flex items-center gap-4 w-full px-4 py-3.5 rounded-xl hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MdMenuBook className="text-blue-400 text-lg" />
                </div>
                <span className="text-white font-medium flex-1 text-left">Resources</span>
                <FaCaretDown className={`text-white/60 transition-transform duration-300 ${resourcesOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ${resourcesOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="ml-14 space-y-1 border-l-2 border-yellow-500/30 pl-4">
                  <Link href="/resources/naat" className="flex items-center gap-3 py-2.5 text-sm text-gray-300 hover:text-yellow-400 transition-colors" onClick={() => setIsOpen(false)}>
                    <FaMicrophone className="text-red-400 text-sm" /> Naat Shareef
                  </Link>
                  <Link href="/resources/audio" className="flex items-center gap-3 py-2.5 text-sm text-gray-300 hover:text-yellow-400 transition-colors" onClick={() => setIsOpen(false)}>
                    <FaHeadphones className="text-green-400 text-sm" /> Audio Library
                  </Link>
                  <Link href="/resources/books" className="flex items-center gap-3 py-2.5 text-sm text-gray-300 hover:text-yellow-400 transition-colors" onClick={() => setIsOpen(false)}>
                    <GiBookCover className="text-yellow-400 text-sm" /> Books & PDFs
                  </Link>
                  <Link href="/resources/bayan" className="flex items-center gap-3 py-2.5 text-sm text-gray-300 hover:text-yellow-400 transition-colors" onClick={() => setIsOpen(false)}>
                    <FaVideo className="text-purple-400 text-sm" /> Bayan
                  </Link>
                  <Link href="/blog" className="flex items-center gap-3 py-2.5 text-sm text-gray-300 hover:text-yellow-400 transition-colors" onClick={() => setIsOpen(false)}>
                    <FaBlog className="text-blue-400 text-sm" /> Articles & Insights
                  </Link>
                  <Link href="/resources/ask" className="flex items-center gap-3 py-2.5 text-sm text-gray-300 hover:text-yellow-400 transition-colors" onClick={() => setIsOpen(false)}>
                    <FaQuestionCircle className="text-orange-400 text-sm" /> Ask & Learn
                  </Link>
                </div>
              </div>
            </div>

            {/* Online Classes */}
            <div>
              <button 
                onClick={() => setClassesOpen(!classesOpen)}
                className="flex items-center gap-4 w-full px-4 py-3.5 rounded-xl hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FaGraduationCap className="text-purple-400 text-lg" />
                </div>
                <span className="text-white font-medium flex-1 text-left">Online Classes</span>
                <FaCaretDown className={`text-white/60 transition-transform duration-300 ${classesOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ${classesOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="ml-14 space-y-1 border-l-2 border-yellow-500/30 pl-4">
                  <Link href="/online-classes/arabic" className="flex items-center gap-3 py-2.5 text-sm text-gray-300 hover:text-yellow-400 transition-colors" onClick={() => setIsOpen(false)}>
                    <FaGlobe className="text-blue-400 text-sm" /> Arabic Classes
                  </Link>
                  <Link href="/online-classes/urdu" className="flex items-center gap-3 py-2.5 text-sm text-gray-300 hover:text-yellow-400 transition-colors" onClick={() => setIsOpen(false)}>
                    <MdMenuBook className="text-green-400 text-sm" /> Urdu Classes
                  </Link>
                  <Link href="/online-classes/bs" className="flex items-center gap-3 py-2.5 text-sm text-gray-300 hover:text-yellow-400 transition-colors" onClick={() => setIsOpen(false)}>
                    <FaBookOpen className="text-yellow-400 text-sm" /> BS Classes
                  </Link>
                  <Link href="/online-classes/english-medium" className="flex items-center gap-3 py-2.5 text-sm text-gray-300 hover:text-yellow-400 transition-colors" onClick={() => setIsOpen(false)}>
                    <FaGlobe className="text-blue-400 text-sm" /> English Medium
                  </Link>
                  <Link href="/online-classes/recitation" className="flex items-center gap-3 py-2.5 text-sm text-gray-300 hover:text-yellow-400 transition-colors" onClick={() => setIsOpen(false)}>
                    <FaMicrophone className="text-red-400 text-sm" /> Online Recitation
                  </Link>
                  <Link href="/online-classes/naat-competition" className="flex items-center gap-3 py-2.5 text-sm text-gray-300 hover:text-yellow-400 transition-colors" onClick={() => setIsOpen(false)}>
                    <FaHeart className="text-pink-400 text-sm" /> Naat Competition
                  </Link>
                </div>
              </div>
            </div>

            <Link href="/durood-count" className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-white/10 transition-all duration-300 group" onClick={() => setIsOpen(false)}>
              <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FaHeart className="text-red-400 text-lg" />
              </div>
              <span className="text-white font-medium">Durood Count</span>
            </Link>

            <Link href="/news" className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-white/10 transition-all duration-300 group" onClick={() => setIsOpen(false)}>
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FaNewspaper className="text-blue-400 text-lg" />
              </div>
              <span className="text-white font-medium">News</span>
            </Link>

            <Link href="/about" className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-white/10 transition-all duration-300 group" onClick={() => setIsOpen(false)}>
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FaInfoCircle className="text-green-400 text-lg" />
              </div>
              <span className="text-white font-medium">About</span>
            </Link>

            <Link href="/contact" className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-white/10 transition-all duration-300 group" onClick={() => setIsOpen(false)}>
              <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FaEnvelope className="text-yellow-400 text-lg" />
              </div>
              <span className="text-white font-medium">Contact</span>
            </Link>

            <div className="px-4 py-2">
              <div className="border-t border-white/10"></div>
            </div>

            {/* Account */}
            <div>
              <button 
                onClick={() => setAccountOpen(!accountOpen)}
                className="flex items-center gap-4 w-full px-4 py-3.5 rounded-xl hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FaUser className="text-green-400 text-lg" />
                </div>
                <span className="text-white font-medium flex-1 text-left">Account</span>
                <FaCaretDown className={`text-white/60 transition-transform duration-300 ${accountOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ${accountOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="ml-14 space-y-1 border-l-2 border-yellow-500/30 pl-4">
                  <Link href="/account/login" className="flex items-center gap-3 py-2.5 text-sm text-gray-300 hover:text-yellow-400 transition-colors" onClick={() => setIsOpen(false)}>
                    <FaSignInAlt className="text-green-400 text-sm" /> Login
                  </Link>
                  <Link href="/account/register" className="flex items-center gap-3 py-2.5 text-sm text-gray-300 hover:text-yellow-400 transition-colors" onClick={() => setIsOpen(false)}>
                    <FaUserPlus className="text-yellow-400 text-sm" /> Register
                  </Link>
                  <div className="border-t border-white/10 my-1"></div>
                  <Link href="/account/submit-durood" className="flex items-center gap-3 py-2.5 text-sm text-gray-300 hover:text-yellow-400 transition-colors" onClick={() => setIsOpen(false)}>
                    <FaHands className="text-red-400 text-sm" /> Submit Durood
                  </Link>
                  <Link href="/account/submit-durood" className="flex items-center gap-3 py-2.5 text-sm text-gray-300 hover:text-yellow-400 transition-colors" onClick={() => setIsOpen(false)}>
                    <FaDonate className="text-red-400 text-sm" /> Donate
                  </Link>
                
                  <div className="border-t border-white/10 my-1"></div>
                  <Link href="/dashboard" className="flex items-center gap-3 py-2.5 text-sm text-gray-300 hover:text-yellow-400 transition-colors" onClick={() => setIsOpen(false)}>
                    <MdDashboard className="text-blue-400 text-sm" /> Dashboard
                  </Link>
                  <Link href="/logout" className="flex items-center gap-3 py-2.5 text-sm text-gray-300 hover:text-yellow-400 transition-colors" onClick={() => setIsOpen(false)}>
                    <FaUser className="text-red-400 text-sm" /> Logout
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-6 border-t border-white/10 mt-4">
            <p className="text-center text-xs text-gray-400">
              © 2024 Markaz-e-Durood. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}