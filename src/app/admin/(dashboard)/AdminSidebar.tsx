'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  FaTachometerAlt,
  FaBookOpen,
  FaMicrophone,
  FaHeart,
  FaImages,
  FaHeadphones,
  FaVideo,
  FaBlog,
  FaNewspaper,
  FaQuestionCircle,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaExternalLinkAlt,
  FaUserTie,
  FaQuran,
  FaBullhorn,
} from 'react-icons/fa'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: FaTachometerAlt, exact: true },
  { href: '/admin/books', label: 'Books', icon: FaBookOpen },
  { href: '/admin/naat', label: 'Naat Shareef', icon: FaMicrophone },
  { href: '/admin/bayan', label: 'Bayan', icon: FaHeart },
  { href: '/admin/audio', label: 'Audio Library', icon: FaHeadphones },
  { href: '/admin/video', label: 'Video Library', icon: FaVideo },
  { href: '/admin/pictures', label: 'Pictures', icon: FaImages },
]

// Markaz-e-Naat: performer profiles (name + photo) and the performances
// linked to them by matching name — shown as its own section in the sidebar.
const naatCenterNavItems = [
  { href: '/admin/naat-khawan', label: 'Naat Khawan (Profiles)', icon: FaUserTie },
  { href: '/admin/qari', label: 'Qari-e-Quran (Profiles)', icon: FaQuran },
  { href: '/admin/qari-recitation', label: 'Qari Recitations', icon: FaHeadphones },
  { href: '/admin/naqabat', label: 'Naqabat (Profiles)', icon: FaBullhorn },
  { href: '/admin/naqabat-videos', label: 'Naqabat Videos', icon: FaVideo },
]

const contentNavItems = [
  { href: '/admin/blog', label: 'Blog', icon: FaBlog },
  { href: '/admin/news', label: 'News', icon: FaNewspaper },
  { href: '/admin/faq', label: 'FAQ', icon: FaQuestionCircle },
]

const allNavItems: { href: string; label: string; icon: typeof FaTachometerAlt; exact?: boolean }[] = [
  ...navItems,
  ...naatCenterNavItems,
  ...contentNavItems,
]

function NavLink({
  href,
  label,
  Icon,
  active,
  onClick,
}: {
  href: string
  label: string
  Icon: React.ComponentType<{ className?: string }>
  active: boolean
  onClick: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        active
          ? 'bg-gold-500/15 text-gold-400'
          : 'text-gray-400 hover:text-white hover:bg-white/5'
      }`}
    >
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-full bg-gold-500" />
      )}
      <Icon className="text-sm flex-shrink-0" />
      <span className="truncate">{label}</span>
    </Link>
  )
}

export default function AdminSidebar({
  adminName,
  adminEmail,
}: {
  adminName: string
  adminEmail: string
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  const activeLabel =
    allNavItems.find((item) => isActive(item.href, item.exact))?.label || 'Dashboard'

  // Close the drawer automatically whenever the route changes (covers
  // back/forward navigation, not just link clicks) and lock page scroll
  // while it's open so the page behind it doesn't scroll along with it.
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  // Let Escape close the drawer too, like any proper dialog.
  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mobileOpen])

  const handleLogout = async () => {
    setLoggingOut(true)
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  const initials =
    adminName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join('') || 'A'

  const Brand = (
    <div className="flex items-center gap-3 px-5 py-6 border-b border-white/10">
      <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-white/5 border border-gold-500/20 flex-shrink-0">
        <Image src="/logo.png" alt="Markaz-e-Durood" fill className="object-contain p-1" />
      </div>
      <div className="min-w-0">
        <p className="text-white font-semibold text-sm truncate">Markaz-e-Durood</p>
        <p className="text-gray-500 text-xs">Admin Panel</p>
      </div>
    </div>
  )

  const SidebarContent = (closeDrawer: () => void) => (
    <div className="flex flex-col h-full">
      {Brand}

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-hide">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            Icon={item.icon}
            active={isActive(item.href, item.exact)}
            onClick={closeDrawer}
          />
        ))}

        <div className="flex items-center gap-2 px-3 pt-4 pb-1.5">
          <span className="text-[10px] uppercase tracking-widest text-gray-600 font-semibold">Markaz-e-Naat</span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>
        {naatCenterNavItems.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            Icon={item.icon}
            active={isActive(item.href)}
            onClick={closeDrawer}
          />
        ))}

        <div className="flex items-center gap-2 px-3 pt-4 pb-1.5">
          <span className="text-[10px] uppercase tracking-widest text-gray-600 font-semibold">Content</span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>
        {contentNavItems.map((item) => (
          <NavLink
            key={item.href}
            label={item.label}
            href={item.href}
            Icon={item.icon}
            active={isActive(item.href)}
            onClick={closeDrawer}
          />
        ))}
      </nav>

      <div className="px-3 pb-3">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <FaExternalLinkAlt className="text-xs flex-shrink-0" />
          View Site
        </a>
      </div>

      <div className="px-5 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-gold-500/15 border border-gold-500/25 text-gold-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{adminName}</p>
            <p className="text-gray-500 text-xs truncate">{adminEmail}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm font-medium transition-colors disabled:opacity-60 w-full"
        >
          <FaSignOutAlt className="text-xs" />
          {loggingOut ? 'Signing out...' : 'Sign out'}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile top bar — sticky, full-width, shows the current section */}
      <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between gap-3 px-4 py-3 border-b border-white/10 bg-ink-900/95 backdrop-blur-md">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative w-7 h-7 rounded-md overflow-hidden bg-white/5 border border-gold-500/20 flex-shrink-0">
            <Image src="/logo.png" alt="Markaz-e-Durood" fill className="object-contain p-0.5" />
          </div>
          <div className="min-w-0">
            <p className="text-white font-semibold text-sm leading-tight truncate">{activeLabel}</p>
            <p className="text-gray-500 text-[11px] leading-tight">Admin Panel</p>
          </div>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation menu"
          className="flex-shrink-0 text-gray-300 hover:text-gold-400 hover:bg-white/5 p-2.5 rounded-lg transition-colors"
        >
          <FaBars />
        </button>
      </header>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 border-r border-white/10 bg-ink-900">
        {SidebarContent(() => {})}
      </aside>

      {/* Mobile drawer — always mounted so the slide/fade transitions can
          animate both in and out, instead of popping instantly. */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!mobileOpen}
      >
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={`absolute inset-y-0 left-0 w-[82%] max-w-xs bg-ink-900 border-r border-white/10 shadow-2xl transition-transform duration-300 ease-out ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation menu"
            className="absolute top-4 right-3 text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <FaTimes />
          </button>
          {SidebarContent(() => setMobileOpen(false))}
        </div>
      </div>
    </>
  )
}
