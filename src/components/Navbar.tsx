'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { 
  FaBars, 
  FaTimes, 
  FaCaretDown, 
  FaHeadphones,
  FaVideo,
  FaFilePdf,
  FaUsers,
  FaUser,
  FaSignInAlt,
  FaUserPlus,
  FaHands,
  FaMicrophone,
  FaHeart,
  FaQuran,
  FaHome,
  FaMosque,
  FaNewspaper,
  FaInfoCircle,
  FaEnvelope,
  FaBlog,
  FaImages,
  FaDonate,
  FaQuestionCircle,
  FaFacebook,
  FaYoutube,
  FaInstagram
} from 'react-icons/fa'
import { FaSquareXTwitter } from 'react-icons/fa6'
import { GiBookCover } from 'react-icons/gi'
import { MdMenuBook, MdDashboard } from 'react-icons/md'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [resourcesOpen, setResourcesOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    router.push('/')
    router.refresh()
  }

  const isActive = (href: string) => pathname === href

  // Check login state once on mount, and again whenever the route changes
  // (e.g. right after logging in/out) so the menu stays in sync.
  useEffect(() => {
    let cancelled = false
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled) setUser(data?.user || null)
      })
      .catch(() => {
        if (!cancelled) setUser(null)
      })
    return () => {
      cancelled = true
    }
  }, [pathname])

  // Add depth once the page is scrolled, so the bar doesn't feel like it's
  // floating flush against page content
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

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
      <nav className={`bg-gradient-to-r from-green-900 via-green-800 to-green-900 text-white fixed w-full top-0 z-50 border-b transition-shadow duration-300 ${
        scrolled ? 'shadow-2xl border-gold-500/30' : 'shadow-md border-gold-500/10'
      }`}>
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
                <span className="text-xl font-bold tracking-wide hover:text-gold-400 transition-colors">
                  Markaz-e-Durood
                </span>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center justify-center flex-1 px-4">
              <div className="flex items-center gap-1">
                <Link href="/" className="px-3 py-2 rounded-lg hover:bg-white/10 hover:text-gold-400 transition-all duration-300 text-sm font-medium whitespace-nowrap">
                  Home
                </Link>
                
                <a href="https://masjidehussain.com/" target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-lg hover:bg-white/10 hover:text-gold-400 transition-all duration-300 text-sm font-medium whitespace-nowrap">
                  Masjid-e-Hussain
                </a>

                {/* Resources Dropdown - Clean Order */}
                <div className="relative group">
                  <button className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-white/10 hover:text-gold-400 transition-all duration-300 text-sm font-medium whitespace-nowrap">
                    Resources <FaCaretDown className="text-xs" />
                  </button>
                  <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="bg-green-800/95 backdrop-blur-sm rounded-xl shadow-2xl py-2 w-56 border border-gold-500/20">
                      <Link href="/resources/naat" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors text-sm">
                        <FaMicrophone className="text-red-400" /> Naat Shareef
                      </Link>
                      <Link href="/resources/audio" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors text-sm">
                        <FaHeadphones className="text-green-400" /> Audio Library
                      </Link>
                      <Link href="/resources/books" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors text-sm">
                        <GiBookCover className="text-gold-400" /> Books & PDFs
                      </Link>
                      <Link href="/resources/bayan" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors text-sm">
                        <FaVideo className="text-purple-400" /> Bayan
                      </Link>
                      <Link href="/resources/videos" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors text-sm">
                        <FaVideo className="text-red-400" /> Video Library
                      </Link>
                      <Link href="/gallery" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors text-sm">
                        <FaImages className="text-pink-400" /> Gallery
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

                <Link href="/durood-count" className="px-3 py-2 rounded-lg hover:bg-white/10 hover:text-gold-400 transition-all duration-300 text-sm font-medium whitespace-nowrap">
                  Durood Count
                </Link>

                <Link href="/account/donate" className="px-3 py-2 rounded-lg hover:bg-white/10 hover:text-gold-400 transition-all duration-300 text-sm font-medium whitespace-nowrap">
                  Donate
                </Link>

                <Link href="/news" className="px-3 py-2 rounded-lg hover:bg-white/10 hover:text-gold-400 transition-all duration-300 text-sm font-medium whitespace-nowrap">
                  News
                </Link>

                <Link href="/about" className="px-3 py-2 rounded-lg hover:bg-white/10 hover:text-gold-400 transition-all duration-300 text-sm font-medium whitespace-nowrap">
                  About
                </Link>

                <Link href="/contact" className="px-3 py-2 rounded-lg hover:bg-white/10 hover:text-gold-400 transition-all duration-300 text-sm font-medium whitespace-nowrap">
                  Contact
                </Link>

                {/* Account Dropdown */}
                <div className="relative group">
                  <button className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-white/10 hover:text-gold-400 transition-all duration-300 text-sm font-medium whitespace-nowrap">
                    {user ? user.name.split(' ')[0] : 'Account'} <FaCaretDown className="text-xs" />
                  </button>
                  <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="bg-green-800/95 backdrop-blur-sm rounded-xl shadow-2xl py-2 w-48 border border-gold-500/20">
                      {user ? (
                        <>
                          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors text-sm">
                            <MdDashboard className="text-blue-400" /> Dashboard
                          </Link>
                          <Link href="/account/submit-durood" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors text-sm">
                            <FaHands className="text-red-400" /> Submit Durood
                          </Link>
                          <Link href="/account/donate" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors text-sm">
                            <FaDonate className="text-red-400" /> Donate
                          </Link>
                          <div className="border-t border-white/10 my-1"></div>
                          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors text-sm text-left">
                            <FaUser className="text-red-400" /> Logout
                          </button>
                        </>
                      ) : (
                        <>
                          <Link href="/account/login" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors text-sm">
                            <FaSignInAlt className="text-green-400" /> Login
                          </Link>
                          <Link href="/account/register" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors text-sm">
                            <FaUserPlus className="text-gold-400" /> Register
                          </Link>
                        </>
                      )}
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
          className={`absolute right-0 top-0 h-full w-[72%] max-w-[280px] bg-gradient-to-b from-green-900 to-green-800 shadow-2xl transition-all duration-500 ease-out overflow-y-auto scrollbar-hide ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>

          {/* Header */}
          <div className="relative px-5 py-5 border-b border-white/10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="relative flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center flex-shrink-0">
                  <img 
                    src="/logo.png" 
                    alt="Markaz-e-Durood" 
                    className="w-7 h-7 object-contain"
                  />
                </div>
                <h3 className="text-sm font-bold text-white truncate">Markaz-e-Durood</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-gray-300 hover:text-gold-400 transition-colors flex-shrink-0"
              >
                <FaTimes className="text-xs" />
              </button>
            </div>
          </div>

          {/* Menu Items */}
          <div className="px-3.5 py-4">

            {/* Section label: Menu */}
            <div className="flex items-center gap-2.5 px-2 mb-1.5">
              <span className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">Menu</span>
              <div className="flex-1 h-px bg-gradient-to-r from-gold-500/20 to-transparent"></div>
            </div>

            <div className="space-y-0.5">
              <Link
                href="/"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 group ${
                  isActive('/') ? 'bg-gold-500/10' : 'hover:bg-white/10'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                  <FaHome className="text-gold-400 text-sm" />
                </div>
                <span className="text-white text-sm font-medium">Home</span>
              </Link>

              <a
                href="https://masjidehussain.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 group hover:bg-white/10"
                onClick={() => setIsOpen(false)}
              >
                <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                  <FaMosque className="text-green-400 text-sm" />
                </div>
                <span className="text-white text-sm font-medium">Masjid-e-Hussain</span>
              </a>

              {/* Resources - Collapsible */}
              <div>
                <button
                  onClick={() => setResourcesOpen(!resourcesOpen)}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                    <MdMenuBook className="text-blue-400 text-sm" />
                  </div>
                  <span className="text-white text-sm font-medium flex-1 text-left">Resources</span>
                  <FaCaretDown className={`text-white/50 text-xs transition-transform duration-300 ${resourcesOpen ? 'rotate-180' : ''}`} />
                </button>

                <div className={`overflow-hidden transition-all duration-300 ${resourcesOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="ml-11 space-y-0.5 border-l-2 border-gold-500/20 pl-3 py-1">
                    <Link href="/resources/naat" className="flex items-center gap-2.5 py-2 text-[13px] text-gray-300 hover:text-gold-400 transition-colors" onClick={() => setIsOpen(false)}>
                      <FaMicrophone className="text-red-400 text-xs" /> Naat Shareef
                    </Link>
                    <Link href="/resources/audio" className="flex items-center gap-2.5 py-2 text-[13px] text-gray-300 hover:text-gold-400 transition-colors" onClick={() => setIsOpen(false)}>
                      <FaHeadphones className="text-green-400 text-xs" /> Audio Library
                    </Link>
                    <Link href="/resources/books" className="flex items-center gap-2.5 py-2 text-[13px] text-gray-300 hover:text-gold-400 transition-colors" onClick={() => setIsOpen(false)}>
                      <GiBookCover className="text-gold-400 text-xs" /> Books & PDFs
                    </Link>
                    <Link href="/resources/bayan" className="flex items-center gap-2.5 py-2 text-[13px] text-gray-300 hover:text-gold-400 transition-colors" onClick={() => setIsOpen(false)}>
                      <FaVideo className="text-purple-400 text-xs" /> Bayan
                    </Link>
                    <Link href="/resources/videos" className="flex items-center gap-2.5 py-2 text-[13px] text-gray-300 hover:text-gold-400 transition-colors" onClick={() => setIsOpen(false)}>
                      <FaVideo className="text-red-400 text-xs" /> Video Library
                    </Link>
                    <Link href="/gallery" className="flex items-center gap-2.5 py-2 text-[13px] text-gray-300 hover:text-gold-400 transition-colors" onClick={() => setIsOpen(false)}>
                      <FaImages className="text-pink-400 text-xs" /> Gallery
                    </Link>
                    <Link href="/blog" className="flex items-center gap-2.5 py-2 text-[13px] text-gray-300 hover:text-gold-400 transition-colors" onClick={() => setIsOpen(false)}>
                      <FaBlog className="text-blue-400 text-xs" /> Articles & Insights
                    </Link>
                    <Link href="/resources/ask" className="flex items-center gap-2.5 py-2 text-[13px] text-gray-300 hover:text-gold-400 transition-colors" onClick={() => setIsOpen(false)}>
                      <FaQuestionCircle className="text-orange-400 text-xs" /> Ask & Learn
                    </Link>
                  </div>
                </div>
              </div>

              <Link
                href="/durood-count"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 group ${
                  isActive('/durood-count') ? 'bg-gold-500/10' : 'hover:bg-white/10'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                  <FaHeart className="text-red-400 text-sm" />
                </div>
                <span className="text-white text-sm font-medium">Durood Count</span>
              </Link>

              <Link
                href="/account/donate"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 group ${
                  isActive('/account/donate') ? 'bg-gold-500/10' : 'hover:bg-white/10'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                  <FaDonate className="text-gold-400 text-sm" />
                </div>
                <span className="text-white text-sm font-medium">Donate</span>
              </Link>

              <Link
                href="/news"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 group ${
                  isActive('/news') ? 'bg-gold-500/10' : 'hover:bg-white/10'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                  <FaNewspaper className="text-blue-400 text-sm" />
                </div>
                <span className="text-white text-sm font-medium">News</span>
              </Link>

              <Link
                href="/about"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 group ${
                  isActive('/about') ? 'bg-gold-500/10' : 'hover:bg-white/10'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                  <FaInfoCircle className="text-green-400 text-sm" />
                </div>
                <span className="text-white text-sm font-medium">About</span>
              </Link>

              <Link
                href="/contact"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 group ${
                  isActive('/contact') ? 'bg-gold-500/10' : 'hover:bg-white/10'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                  <FaEnvelope className="text-gold-400 text-sm" />
                </div>
                <span className="text-white text-sm font-medium">Contact</span>
              </Link>
            </div>

            {/* Section label: Account */}
            <div className="flex items-center gap-2.5 px-2 mt-4 mb-1.5">
              <span className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">Account</span>
              <div className="flex-1 h-px bg-gradient-to-r from-gold-500/20 to-transparent"></div>
            </div>

            <div className="space-y-0.5">
              <div>
                <button
                  onClick={() => setAccountOpen(!accountOpen)}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                    <FaUser className="text-green-400 text-sm" />
                  </div>
                  <span className="text-white text-sm font-medium flex-1 text-left">
                    {user ? user.name.split(' ')[0] : 'My Account'}
                  </span>
                  <FaCaretDown className={`text-white/50 text-xs transition-transform duration-300 ${accountOpen ? 'rotate-180' : ''}`} />
                </button>

                <div className={`overflow-hidden transition-all duration-300 ${accountOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="ml-11 space-y-0.5 border-l-2 border-gold-500/20 pl-3 py-1">
                    {user ? (
                      <>
                        <Link href="/dashboard" className="flex items-center gap-2.5 py-2 text-[13px] text-gray-300 hover:text-gold-400 transition-colors" onClick={() => setIsOpen(false)}>
                          <MdDashboard className="text-blue-400 text-xs" /> Dashboard
                        </Link>
                        <Link href="/account/submit-durood" className="flex items-center gap-2.5 py-2 text-[13px] text-gray-300 hover:text-gold-400 transition-colors" onClick={() => setIsOpen(false)}>
                          <FaHands className="text-red-400 text-xs" /> Submit Durood
                        </Link>
                        <Link href="/account/donate" className="flex items-center gap-2.5 py-2 text-[13px] text-gray-300 hover:text-gold-400 transition-colors" onClick={() => setIsOpen(false)}>
                          <FaDonate className="text-red-400 text-xs" /> Donate
                        </Link>
                        <div className="border-t border-white/10 my-1"></div>
                        <button onClick={() => { setIsOpen(false); handleLogout(); }} className="w-full flex items-center gap-2.5 py-2 text-[13px] text-gray-300 hover:text-gold-400 transition-colors text-left">
                          <FaUser className="text-red-400 text-xs" /> Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link href="/account/login" className="flex items-center gap-2.5 py-2 text-[13px] text-gray-300 hover:text-gold-400 transition-colors" onClick={() => setIsOpen(false)}>
                          <FaSignInAlt className="text-green-400 text-xs" /> Login
                        </Link>
                        <Link href="/account/register" className="flex items-center gap-2.5 py-2 text-[13px] text-gray-300 hover:text-gold-400 transition-colors" onClick={() => setIsOpen(false)}>
                          <FaUserPlus className="text-gold-400 text-xs" /> Register
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-5 mt-2">
            <div className="h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent mb-4"></div>
            <div className="flex items-center justify-center gap-3 mb-3">
              <a href="https://www.facebook.com/sultanfiazulhassan?mibextid=LQQJ4d" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-7 h-7 rounded-full bg-white/5 hover:bg-gold-500/20 text-gray-400 hover:text-gold-400 flex items-center justify-center transition-colors">
                <FaFacebook className="text-xs" />
              </a>
              <a href="https://x.com/haqbahu?t=tLwATs-7Bk9pAF4__IJgTw&s=09" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="w-7 h-7 rounded-full bg-white/5 hover:bg-gold-500/20 text-gray-400 hover:text-gold-400 flex items-center justify-center transition-colors">
                <FaSquareXTwitter className="text-xs" />
              </a>
              <a href="https://www.youtube.com/@SultanFiazulHassan-Qadri" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-7 h-7 rounded-full bg-white/5 hover:bg-gold-500/20 text-gray-400 hover:text-gold-400 flex items-center justify-center transition-colors">
                <FaYoutube className="text-xs" />
              </a>
              <a href="https://www.instagram.com/sultanfiazulhassan?igsh=MWtndGNwNjVpYWRoNw%3D%3D" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-7 h-7 rounded-full bg-white/5 hover:bg-gold-500/20 text-gray-400 hover:text-gold-400 flex items-center justify-center transition-colors">
                <FaInstagram className="text-xs" />
              </a>
            </div>
            <p className="text-center text-[11px] text-gray-500">
              © {new Date().getFullYear()} Markaz-e-Durood. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}