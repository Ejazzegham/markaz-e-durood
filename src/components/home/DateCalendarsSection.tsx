'use client'

import { useEffect, useState } from 'react'
import { FaCalendarAlt, FaMoon, FaLeaf, FaClock } from 'react-icons/fa'
import { gregorianToHijri } from '@/lib/calendar/hijri'
import { gregorianToBikrami } from '@/lib/calendar/bikrami'

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const GREGORIAN_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

interface CalendarCardProps {
  icon: React.ReactNode
  label: string
  day: number | string
  monthYear: string
  subtitle?: string
  footer?: React.ReactNode
}

function CalendarCard({ icon, label, day, monthYear, subtitle, footer }: CalendarCardProps) {
  return (
    <div className="relative flex-1 min-w-0 bg-gradient-to-b from-green-850/90 to-green-850/60 border border-gold-500/20 rounded-2xl p-5 sm:p-6 shadow-lg shadow-black/20 hover:border-gold-500/40 transition-colors duration-300">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="p-2 rounded-lg bg-gold-500/10 border border-gold-500/20 text-gold-500 text-sm shrink-0">
          {icon}
        </div>
        <p className="text-gray-300 text-xs sm:text-sm font-semibold uppercase tracking-wider truncate">{label}</p>
      </div>

      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="text-white text-4xl sm:text-5xl font-bold tabular-nums leading-none">{day}</span>
      </div>
      <p className="text-gold-400 text-sm sm:text-base font-medium mt-1.5">{monthYear}</p>
      {subtitle && <p className="text-gray-500 text-xs mt-0.5 truncate">{subtitle}</p>}

      {footer && <div className="mt-3 pt-3 border-t border-gold-500/10">{footer}</div>}
    </div>
  )
}

// Three calendars, side by side — Gregorian (with a live clock), Hijri
// (Umm al-Qura) and the Punjabi Desi/Bikrami solar calendar. Refreshes
// every second so the clock and any midnight date roll-over stay live
// without a page reload.
export default function DateCalendarsSection() {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Avoid a server/client markup mismatch — render nothing until mounted,
  // then the cards appear together with today's real date and a ticking clock.
  if (!now) {
    return <div className="h-[200px] sm:h-[188px]" aria-hidden="true" />
  }

  const hijri = gregorianToHijri(now)
  const bikrami = gregorianToBikrami(now)
  const weekday = WEEKDAYS[now.getDay()]
  const clockLabel = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' })

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <CalendarCard
        icon={<FaCalendarAlt />}
        label="English"
        day={now.getDate()}
        monthYear={`${GREGORIAN_MONTHS[now.getMonth()]} ${now.getFullYear()}`}
        subtitle={weekday}
        footer={
          <div className="flex items-center gap-2 text-gold-400 text-sm font-mono tabular-nums">
            <FaClock className="text-xs" />
            {clockLabel}
          </div>
        }
      />
      <CalendarCard
        icon={<FaMoon />}
        label="Islamic — Hijri"
        day={hijri.day}
        monthYear={`${hijri.monthName} ${hijri.year} AH`}
        subtitle={hijri.monthNameArabic}
        footer={<p className="text-gray-500 text-[11px]">Umm al-Qura calculation — may vary ±1 day by moon sighting</p>}
      />
      <CalendarCard
        icon={<FaLeaf />}
        label="Punjabi — Bikrami"
        day={bikrami.day}
        monthYear={`${bikrami.monthName} ${bikrami.year} Bk`}
        subtitle={bikrami.monthNameGurmukhi}
        footer={<p className="text-gray-500 text-[11px]">Desi solar calendar — Chet 1 (New Year) falls on 14 March</p>}
      />
    </div>
  )
}
