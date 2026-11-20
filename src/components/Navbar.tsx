'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  FaTimes,
  FaChevronDown,
  FaAngleRight,
  FaHeadphones,
  FaVideo,
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
  FaInstagram,
  FaSignOutAlt,
  FaExternalLinkAlt,
} from 'react-icons/fa'
import { FaSquareXTwitter } from 'react-icons/fa6'
import { GiBookCover } from 'react-icons/gi'
import { MdMenuBook, MdDashboard } from 'react-icons/md'
import type { ReactNode } from 'react'

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

// Every class string here is complete and static so Tailwind's JIT can see it.
const resourceItems: {
  href: string
  label: string
  desc: string
  icon: ReactNode
  chip: string
}[] = [
  { href: '/resources/naat', label: 'Naat Shareef', desc: 'Devotional recitations', chip: 'bg-red-500/10 border-red-500/20 text-red-400', icon: <FaMicrophone /> },
  { href: '/resources/audio', label: 'Audio Library', desc: 'Listen anywhere', chip: 'bg-green-500/10 border-green-500/20 text-green-400', icon: <FaHeadphones /> },
  { href: '/resources/books', label: 'Books & PDFs', desc: 'Read and download', chip: 'bg-gold-500/10 border-gold-500/20 text-gold-400', icon: <GiBookCover /> },
  { href: '/resources/bayan', label: 'Bayan', desc: 'Spiritual talks', chip: 'bg-purple-500/10 border-purple-500/20 text-purple-400', icon: <FaVideo /> },
  { href: '/resources/videos', label: 'Video Library', desc: 'Watch and learn', chip: 'bg-red-500/10 border-red-500/20 text-red-400', icon: <FaVideo /> },
  { href: '/gallery', label: 'Gallery', desc: 'Moments and events', chip: 'bg-pink-500/10 border-pink-500/20 text-pink-400', icon: <FaImages /> },
  { href: '/blog', label: 'Articles & Insights', desc: 'Reflections and guidance', chip: 'bg-blue-500/10 border-blue-500/20 text-blue-400', icon: <FaBlog /> },
  { href: '/news', label: 'News', desc: 'Latest updates', chip: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400', icon: <FaNewspaper /> },
  { href: '/resources/ask', label: 'Ask & Learn', desc: 'Questions answered', chip: 'bg-orange-500/10 border-orange-500/20 text-orange-400', icon: <FaQuestionCircle /> },
]

const resourcePaths = ['/resources', '/gallery', '/blog', '/news']

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */

// Top-level desktop link with a gold underline that grows in on hover/active.
function NavLink({
  href,
  label,
  active,
  external = false,
  tone = 'default',
}: {
  href: string
  label: string
  active?: boolean
  external?: boolean
  tone?: 'default' | 'blue'
}) {
  const color =
    tone === 'blue'
      ? 'text-blue-300/90 hover:text-blue-200'
      : active
        ? 'text-gold-400'
        : 'text-white/75 hover:text-white'

  const cls = `group/link relative px-2.5 xl:px-3 py-2 text-[12.5px] font-medium tracking-wide whitespace-nowrap transition-colors duration-300 ${color}`

  const underline = (
    <span
      className={`absolute left-2.5 right-2.5 xl:left-3 xl:right-3 -bottom-px h-px origin-center bg-gradient-to-r from-transparent via-gold-500 to-transparent transition-transform duration-300 ${
        active ? 'scale-x-100' : 'scale-x-0 group-hover/link:scale-x-100'
      }`}
    />
  )

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        <span className="inline-flex items-center gap-1">
          {label}
          <FaExternalLinkAlt className="text-[7px] opacity-60" />
        </span>
        {underline}
      </a>
    )
  }

  return (
    <Link href={href} className={cls}>
      {label}
      {underline}
    </Link>
  )
}

// A row inside the account dropdown.
function MenuRow({
  href,
  icon,
  label,
  onClick,
  danger = false,
}: {
  href?: string
  icon: ReactNode
  label: string
  onClick?: () => void
  danger?: boolean
}) {
  const cls = `group/row flex w-full items-center gap-2.5 mx-1.5 px-2.5 py-2 rounded-lg text-[12.5px] transition-colors duration-200 text-left ${
    danger ? 'text-red-300/90 hover:bg-red-500/10' : 'text-gray-200 hover:bg-white/[0.06] hover:text-gold-400'
  }`
  const inner = (
    <>
      <span className="w-7 h-7 rounded-md bg-white/[0.04] border border-white/10 flex items-center justify-center text-[11px] text-gold-400 group-hover/row:border-gold-500/30 transition-colors">
        {icon}
      </span>
      <span className="flex-1">{label}</span>
    </>
  )
  // Row is wrapped so the hover background has a little breathing room
  if (href) {
    return (
      <Link href={href} className={cls} style={{ width: 'calc(100% - 12px)' }}>
        {inner}
      </Link>
    )
  }
  return (
    <button onClick={onClick} className={cls} style={{ width: 'calc(100% - 12px)' }}>
      {inner}
    </button>
  )
}

/* ------------------------------------------------------------------ */
/* Navbar                                                              */
/* ------------------------------------------------------------------ */

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

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/'))
  const resourcesActive = resourcePaths.some((p) => isActive(p))

  // Login state: on mount and whenever the route changes
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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const closeMobile = () => setIsOpen(false)

  // Shared mobile row styling
  const mobileRow = (active: boolean) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-300 group ${
      active ? 'bg-gold-500/10 ring-1 ring-gold-500/20' : 'hover:bg-white/[0.06]'
    }`
  const mobileChip = (chip: string) =>
    `w-8 h-8 rounded-lg border flex items-center justify-center text-sm flex-shrink-0 group-hover:scale-110 transition-transform ${chip}`

  return (
    <>
      <nav
        className={`fixed w-full top-0 z-50 text-white backdrop-blur-xl transition-all duration-300 border-b ${
          scrolled
            ? 'bg-green-950/90 border-gold-500/25 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.7)]'
            : 'bg-green-950/75 border-white/5'
        }`}
      >
        {/* Fine gold hairline across the very top */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/60 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:grid lg:grid-cols-[auto_1fr_auto] lg:gap-x-6">
            {/* Brand */}
            <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0 justify-self-start">
              <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-gold-500/20 to-transparent ring-1 ring-gold-500/30 p-1 group-hover:ring-gold-500/60 transition-all duration-300">
                <Image src="/logo.png" alt="Markaz-e-Durood" fill sizes="36px" priority className="object-contain p-1" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[13px] font-semibold tracking-[0.14em] uppercase whitespace-nowrap text-white group-hover:text-gold-400 transition-colors duration-300">
                  Markaz-e-Durood
                </span>
                <span className="hidden sm:block mt-1 text-[8.5px] tracking-[0.32em] uppercase text-gold-500/70">
                  Salawat · Naat · Quran
                </span>
              </div>
            </Link>

            {/* Desktop menu */}
            <div className="hidden lg:flex items-center justify-center justify-self-center">
              <div className="flex items-center">
                <NavLink href="/" label="Home" active={isActive('/')} />
                <NavLink href="/markaz-e-naat" label="Markaz-e-Naat" active={isActive('/markaz-e-naat')} />
                <NavLink href="/quran" label="Quran Pak" active={isActive('/quran')} />

                {/* Resources — mega dropdown */}
                <div className="relative group">
                  <button
                    className={`group/link relative flex items-center gap-1 px-2.5 xl:px-3 py-2 text-[12.5px] font-medium tracking-wide whitespace-nowrap transition-colors duration-300 ${
                      resourcesActive ? 'text-gold-400' : 'text-white/75 hover:text-white group-hover:text-white'
                    }`}
                    aria-haspopup="true"
                  >
                    Resources
                    <FaChevronDown className="text-[8px] opacity-70 transition-transform duration-300 group-hover:rotate-180 group-focus-within:rotate-180" />
                    <span
                      className={`absolute left-2.5 right-2.5 xl:left-3 xl:right-3 -bottom-px h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent transition-transform duration-300 ${
                        resourcesActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </button>

                  <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 transition-all duration-300 ease-out z-50">
                    <div className="relative w-[640px] rounded-2xl border border-gold-500/25 bg-green-950/95 backdrop-blur-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden flex">
                      {/* Featured side */}
                      <div className="relative w-[200px] flex-shrink-0 p-5 flex flex-col justify-between bg-gradient-to-br from-gold-500/15 via-green-900/60 to-green-950 border-r border-gold-500/15 overflow-hidden">
                        <div className="pointer-events-none absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-gold-500/15 blur-3xl" />
                        <div className="relative">
                          <span className="w-10 h-10 rounded-xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center text-gold-400">
                            <MdMenuBook />
                          </span>
                          <h4 className="mt-4 text-[15px] font-semibold text-white font-display">Resources</h4>
                          <p className="mt-1.5 text-[11px] leading-relaxed text-gray-400">
                            Naat, audio, books, bayan and more — a growing library for your heart and home.
                          </p>
                        </div>
                        <Link
                          href="/resources"
                          className="relative mt-5 inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-gold-400 hover:text-gold-300 transition-colors group/all"
                        >
                          View all
                          <FaAngleRight className="text-[10px] group-hover/all:translate-x-1 transition-transform" />
                        </Link>
                      </div>

                      {/* Links */}
                      <div className="relative flex-1 grid grid-cols-2 gap-0.5 p-2.5">
                        {resourceItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`group/item flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all duration-200 ${
                              isActive(item.href)
                                ? 'bg-gold-500/10 border-gold-500/25'
                                : 'border-transparent hover:bg-white/[0.06] hover:border-white/10'
                            }`}
                          >
                            <span
                              className={`w-9 h-9 rounded-lg border flex items-center justify-center text-[13px] flex-shrink-0 group-hover/item:scale-110 transition-transform duration-200 ${item.chip}`}
                            >
                              {item.icon}
                            </span>
                            <span className="flex-1 min-w-0">
                              <span className="block text-[12.5px] font-medium text-gray-100 group-hover/item:text-gold-400 transition-colors truncate">
                                {item.label}
                              </span>
                              <span className="block text-[10.5px] text-gray-500 truncate">{item.desc}</span>
                            </span>
                            <FaAngleRight className="text-[10px] text-gold-500/0 -translate-x-1 group-hover/item:text-gold-500/80 group-hover/item:translate-x-0 transition-all duration-200" />
                          </Link>
                        ))}
                    </div>
                    </div>
                  </div>
                </div>

                <NavLink href="/durood-count" label="Durood Count" active={isActive('/durood-count')} />
                <NavLink href="/about" label="About" active={isActive('/about')} />
                <NavLink href="/contact" label="Contact" active={isActive('/contact')} />
                <NavLink href="https://masjidehussain.com/" label="Masjid-e-Hussain" external tone="blue" />
              </div>
            </div>

            {/* Desktop right cluster: Donate pill + account */}
            <div className="hidden lg:flex items-center gap-2 justify-self-end">
              <Link
                href="/account/donate"
                className="group/donate relative inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-semibold tracking-wide text-green-950 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400 shadow-[0_4px_14px_-4px_rgba(212,175,55,0.6)] hover:shadow-[0_6px_20px_-4px_rgba(212,175,55,0.8)] hover:-translate-y-px transition-all duration-300"
              >
                <FaHeart className="text-[10px]" />
                Donate
              </Link>

              {/* Account dropdown */}
              <div className="relative group">
                <button
                  className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full border border-white/10 bg-white/[0.04] hover:border-gold-500/40 hover:bg-white/[0.08] transition-all duration-300"
                  aria-haspopup="true"
                >
                  <span className="w-6 h-6 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 text-green-950 flex items-center justify-center text-[10px] font-bold">
                    {user ? user.name.trim().charAt(0).toUpperCase() : <FaUser className="text-[9px]" />}
                  </span>
                  <span className="text-[12px] font-medium text-white/85 max-w-[80px] truncate">
                    {user ? user.name.split(' ')[0] : 'Account'}
                  </span>
                  <FaChevronDown className="text-[8px] text-white/50 transition-transform duration-300 group-hover:rotate-180 group-focus-within:rotate-180" />
                </button>

                <div className="absolute right-0 top-full pt-3 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 transition-all duration-300 ease-out z-50">
                  <div className="relative w-56 rounded-2xl border border-gold-500/20 bg-green-950/95 backdrop-blur-2xl shadow-2xl shadow-black/60 overflow-hidden">
                    <div className="h-[2px] bg-gradient-to-r from-transparent via-gold-500 to-transparent" />

                    {/* Identity header */}
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
                      <span className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 text-green-950 flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {user ? user.name.trim().charAt(0).toUpperCase() : <FaUser className="text-xs" />}
                      </span>
                      <div className="min-w-0">
                        <p className="text-[12.5px] font-semibold text-white truncate">{user ? user.name : 'Welcome'}</p>
                        <p className="text-[10.5px] text-gray-500 truncate">{user ? user.email : 'Sign in to join the Durood count'}</p>
                      </div>
                    </div>

                    <div className="py-1.5 flex flex-col items-center">
                      {user ? (
                        <>
                          <MenuRow href="/dashboard" icon={<MdDashboard />} label="Dashboard" />
                          <MenuRow href="/account/submit-durood" icon={<FaHands />} label="Submit Durood" />
                          <MenuRow href="/account/donate" icon={<FaDonate />} label="Donate" />
                          <div className="w-[calc(100%-24px)] h-px bg-white/5 my-1" />
                          <MenuRow onClick={handleLogout} icon={<FaSignOutAlt />} label="Logout" danger />
                        </>
                      ) : (
                        <>
                          <MenuRow href="/account/login" icon={<FaSignInAlt />} label="Login" />
                          <MenuRow href="/account/register" icon={<FaUserPlus />} label="Create account" />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/10 transition-all duration-300 flex-shrink-0"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              <div className="relative w-[18px] h-3.5">
                <span className={`absolute left-0 w-full h-px bg-white rounded-full transition-all duration-300 ${isOpen ? 'top-[7px] rotate-45' : 'top-0'}`}></span>
                <span className={`absolute left-0 w-full h-px bg-white rounded-full transition-all duration-300 ${isOpen ? 'opacity-0' : 'top-[7px]'}`}></span>
                <span className={`absolute left-0 w-full h-px bg-white rounded-full transition-all duration-300 ${isOpen ? 'top-[7px] -rotate-45' : 'top-[14px]'}`}></span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* ============================================
          MOBILE MENU
          ============================================ */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        style={{ top: '64px' }}
      >
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={closeMobile}
        ></div>

        <div
          className={`absolute right-0 top-0 h-full w-[78%] max-w-[300px] bg-gradient-to-b from-green-950 to-green-900 shadow-2xl transition-all duration-500 ease-out overflow-y-auto scrollbar-hide ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>

          <div className="px-3.5 py-4">
            <div className="flex items-center gap-2.5 px-2 mb-1.5">
              <span className="text-[10px] uppercase tracking-[0.25em] text-gray-500 font-semibold">Menu</span>
              <div className="flex-1 h-px bg-gradient-to-r from-gold-500/20 to-transparent"></div>
            </div>

            <div className="space-y-0.5">
              <Link href="/" className={mobileRow(isActive('/'))} onClick={closeMobile}>
                <div className={mobileChip('bg-gold-500/10 border-gold-500/20 text-gold-400')}><FaHome /></div>
                <span className="text-white text-[13px] font-medium">Home</span>
              </Link>

              <Link href="/markaz-e-naat" className={mobileRow(isActive('/markaz-e-naat'))} onClick={closeMobile}>
                <div className={mobileChip('bg-red-500/10 border-red-500/20 text-red-400')}><FaMicrophone /></div>
                <span className="text-white text-[13px] font-medium">Markaz-e-Naat</span>
              </Link>

              <Link href="/quran" className={mobileRow(isActive('/quran'))} onClick={closeMobile}>
                <div className={mobileChip('bg-gold-500/10 border-gold-500/20 text-gold-400')}><FaQuran /></div>
                <span className="text-white text-[13px] font-medium">Quran Pak</span>
              </Link>

              {/* Resources - collapsible */}
              <div>
                <button
                  onClick={() => setResourcesOpen(!resourcesOpen)}
                  className={`${mobileRow(resourcesActive)} w-full`}
                >
                  <div className={mobileChip('bg-blue-500/10 border-blue-500/20 text-blue-400')}><MdMenuBook /></div>
                  <span className="text-white text-[13px] font-medium flex-1 text-left">Resources</span>
                  <FaChevronDown className={`text-white/40 text-[9px] transition-transform duration-300 ${resourcesOpen ? 'rotate-180' : ''}`} />
                </button>

                <div className={`overflow-hidden transition-all duration-300 ${resourcesOpen ? 'max-h-[28rem] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="ml-[22px] space-y-0.5 border-l border-gold-500/20 pl-3 py-1">
                    {resourceItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-2.5 py-2 text-[12.5px] transition-colors ${
                          isActive(item.href) ? 'text-gold-400' : 'text-gray-300 hover:text-gold-400'
                        }`}
                        onClick={closeMobile}
                      >
                        <span className={`text-xs ${item.chip.split(' ').pop()}`}>{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <Link href="/durood-count" className={mobileRow(isActive('/durood-count'))} onClick={closeMobile}>
                <div className={mobileChip('bg-red-500/10 border-red-500/20 text-red-400')}><FaHeart /></div>
                <span className="text-white text-[13px] font-medium">Durood Count</span>
              </Link>

              <Link href="/about" className={mobileRow(isActive('/about'))} onClick={closeMobile}>
                <div className={mobileChip('bg-green-500/10 border-green-500/20 text-green-400')}><FaInfoCircle /></div>
                <span className="text-white text-[13px] font-medium">About</span>
              </Link>

              <Link href="/contact" className={mobileRow(isActive('/contact'))} onClick={closeMobile}>
                <div className={mobileChip('bg-gold-500/10 border-gold-500/20 text-gold-400')}><FaEnvelope /></div>
                <span className="text-white text-[13px] font-medium">Contact</span>
              </Link>

              <a
                href="https://masjidehussain.com/"
                target="_blank"
                rel="noopener noreferrer"
                className={mobileRow(false)}
                onClick={closeMobile}
              >
                <div className={mobileChip('bg-blue-500/10 border-blue-500/20 text-blue-400')}><FaMosque /></div>
                <span className="text-blue-300 text-[13px] font-medium flex-1">Masjid-e-Hussain</span>
                <FaExternalLinkAlt className="text-[8px] text-blue-300/50" />
              </a>
            </div>

            {/* Donate CTA */}
            <Link
              href="/account/donate"
              onClick={closeMobile}
              className="mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold text-green-950 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400 shadow-[0_6px_18px_-6px_rgba(212,175,55,0.7)]"
            >
              <FaHeart className="text-xs" /> Donate
            </Link>

            {/* Account */}
            <div className="flex items-center gap-2.5 px-2 mt-5 mb-1.5">
              <span className="text-[10px] uppercase tracking-[0.25em] text-gray-500 font-semibold">Account</span>
              <div className="flex-1 h-px bg-gradient-to-r from-gold-500/20 to-transparent"></div>
            </div>

            <div>
              <button onClick={() => setAccountOpen(!accountOpen)} className={`${mobileRow(false)} w-full`}>
                <div className={mobileChip('bg-green-500/10 border-green-500/20 text-green-400')}><FaUser /></div>
                <span className="text-white text-[13px] font-medium flex-1 text-left">
                  {user ? user.name.split(' ')[0] : 'My Account'}
                </span>
                <FaChevronDown className={`text-white/40 text-[9px] transition-transform duration-300 ${accountOpen ? 'rotate-180' : ''}`} />
              </button>

              <div className={`overflow-hidden transition-all duration-300 ${accountOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="ml-[22px] space-y-0.5 border-l border-gold-500/20 pl-3 py-1">
                  {user ? (
                    <>
                      <Link href="/dashboard" className="flex items-center gap-2.5 py-2 text-[12.5px] text-gray-300 hover:text-gold-400 transition-colors" onClick={closeMobile}>
                        <MdDashboard className="text-blue-400 text-xs" /> Dashboard
                      </Link>
                      <Link href="/account/submit-durood" className="flex items-center gap-2.5 py-2 text-[12.5px] text-gray-300 hover:text-gold-400 transition-colors" onClick={closeMobile}>
                        <FaHands className="text-red-400 text-xs" /> Submit Durood
                      </Link>
                      <Link href="/account/donate" className="flex items-center gap-2.5 py-2 text-[12.5px] text-gray-300 hover:text-gold-400 transition-colors" onClick={closeMobile}>
                        <FaDonate className="text-red-400 text-xs" /> Donate
                      </Link>
                      <div className="border-t border-white/10 my-1"></div>
                      <button
                        onClick={() => {
                          closeMobile()
                          handleLogout()
                        }}
                        className="w-full flex items-center gap-2.5 py-2 text-[12.5px] text-gray-300 hover:text-gold-400 transition-colors text-left"
                      >
                        <FaSignOutAlt className="text-red-400 text-xs" /> Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/account/login" className="flex items-center gap-2.5 py-2 text-[12.5px] text-gray-300 hover:text-gold-400 transition-colors" onClick={closeMobile}>
                        <FaSignInAlt className="text-green-400 text-xs" /> Login
                      </Link>
                      <Link href="/account/register" className="flex items-center gap-2.5 py-2 text-[12.5px] text-gray-300 hover:text-gold-400 transition-colors" onClick={closeMobile}>
                        <FaUserPlus className="text-gold-400 text-xs" /> Register
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 pb-6 pt-2">
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
            <p className="text-center text-[11px] text-gray-500">© {new Date().getFullYear()} Markaz-e-Durood. All rights reserved.</p>
          </div>
        </div>
      </div>
    </>
  )
}
