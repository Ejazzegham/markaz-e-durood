'use client'

import { useState } from 'react'
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

  const handleLogout = async () => {
    setLoggingOut(true)
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  const SidebarContent = (
    <div className="flex flex-col h-full">
      <div className="px-5 py-6 border-b border-white/10">
        <p className="text-white font-semibold text-sm">Markaz-e-Durood</p>
        <p className="text-gray-500 text-xs">Admin Panel</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-hide">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href, item.exact)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-gold-500/15 text-gold-400'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="text-sm flex-shrink-0" />
              {item.label}
            </Link>
          )
        })}

        <div className="flex items-center gap-2 px-3 pt-4 pb-1.5">
          <span className="text-[10px] uppercase tracking-widest text-gray-600 font-semibold">Markaz-e-Naat</span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>
        {naatCenterNavItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-gold-500/15 text-gold-400'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="text-sm flex-shrink-0" />
              {item.label}
            </Link>
          )
        })}

        <div className="flex items-center gap-2 px-3 pt-4 pb-1.5">
          <span className="text-[10px] uppercase tracking-widest text-gray-600 font-semibold">Content</span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>
        {contentNavItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-gold-500/15 text-gold-400'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="text-sm flex-shrink-0" />
              {item.label}
            </Link>
          )
        })}
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
        <p className="text-white text-sm font-medium truncate">{adminName}</p>
        <p className="text-gray-500 text-xs truncate mb-3">{adminEmail}</p>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm font-medium transition-colors disabled:opacity-60"
        >
          <FaSignOutAlt className="text-xs" />
          {loggingOut ? 'Signing out...' : 'Sign out'}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-white/10 bg-ink-900">
        <p className="text-white font-semibold text-sm">Admin Panel</p>
        <button onClick={() => setMobileOpen(true)} className="text-gray-300 p-2">
          <FaBars />
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 border-r border-white/10 bg-ink-900">
        {SidebarContent}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-72 bg-ink-900 border-r border-white/10 h-full">
            <div className="flex justify-end px-3 pt-3">
              <button onClick={() => setMobileOpen(false)} className="text-gray-300 p-2">
                <FaTimes />
              </button>
            </div>
            {SidebarContent}
          </div>
          <div className="flex-1 bg-black/60" onClick={() => setMobileOpen(false)} />
        </div>
      )}
    </>
  )
}
