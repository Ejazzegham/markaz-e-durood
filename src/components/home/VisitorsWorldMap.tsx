'use client'

import { useEffect, useMemo, useState } from 'react'
import { ComposableMap, Geographies, Geography, Sphere, Graticule, Marker } from 'react-simple-maps'
import { FaGlobeAmericas, FaUsers, FaFlag, FaBolt, FaSpinner, FaCircle } from 'react-icons/fa'
import { countryCodeToFlag } from '@/lib/geo/countryFlag'

const GEO_URL = '/data/world-110m.json'
const POLL_MS = 45000

interface CountryStat {
  country: string
  countryCode: string
  visitors: number
  visits: number
}

interface MarkerPoint {
  lat: number
  lng: number
  city: string
  country: string
  countryCode: string
  count: number
}

interface RecentVisitor {
  city: string
  country: string
  countryCode: string
  lastSeenAt: string
}

interface VisitorStats {
  totalVisitors: number
  totalVisits: number
  totalCountries: number
  newToday: number
  topCountries: CountryStat[]
  markers: MarkerPoint[]
  recentVisitors: RecentVisitor[]
}

function formatNumber(n: number) {
  return new Intl.NumberFormat('en-US').format(n || 0)
}

function markerRadius(count: number) {
  return Math.min(9, Math.max(3, 3 + Math.sqrt(count) * 1.3))
}

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime()
  const diffSec = Math.max(0, Math.floor((Date.now() - then) / 1000))
  if (diffSec < 60) return 'just now'
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  const diffDay = Math.floor(diffHr / 24)
  return `${diffDay}d ago`
}

export default function VisitorsWorldMap() {
  const [stats, setStats] = useState<VisitorStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false

    const load = () => {
      fetch('/api/visitors/stats')
        .then((res) => {
          if (!res.ok) throw new Error('bad response')
          return res.json()
        })
        .then((data: VisitorStats) => {
          if (cancelled) return
          setStats(data)
          setFailed(false)
        })
        .catch(() => {
          if (!cancelled) setFailed(true)
        })
        .finally(() => {
          if (!cancelled) setLoading(false)
        })
    }

    load()
    const interval = setInterval(load, POLL_MS)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  const statCards = useMemo(
    () => [
      { icon: <FaUsers />, label: 'Total Visitors', value: stats ? formatNumber(stats.totalVisitors) : '—' },
      { icon: <FaFlag />, label: 'Countries Reached', value: stats ? formatNumber(stats.totalCountries) : '—' },
      { icon: <FaBolt />, label: 'New Today', value: stats ? formatNumber(stats.newToday) : '—' },
    ],
    [stats]
  )

  const hasData = !!stats && stats.totalVisitors > 0

  return (
    <div className="relative bg-gradient-to-b from-green-850/90 to-green-850/60 border border-gold-500/20 rounded-2xl p-5 sm:p-7 shadow-lg shadow-black/20 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-gold-500/10 border border-gold-500/20 text-gold-500">
            <FaGlobeAmericas className="text-sm" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg leading-tight">Visitors Worldwide</h3>
            <p className="text-gray-500 text-[11px]">Every Durood lover, live on the map</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-green-400/30 bg-green-400/10 text-[11px] font-semibold text-green-400">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400"></span>
          </span>
          Live
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-14 text-gray-500 text-sm gap-2">
          <FaSpinner className="animate-spin" /> Loading visitor data...
        </div>
      ) : failed ? (
        <div className="flex items-center justify-center py-14 text-gray-500 text-sm text-center px-6">
          Visitor map is temporarily unavailable — please check back shortly.
        </div>
      ) : (
        <>
          {/* Stat strip */}
          <div className="grid grid-cols-3 gap-2.5 mb-4">
            {statCards.map((s, i) => (
              <div
                key={i}
                className="rounded-xl border border-white/5 bg-white/[0.02] px-3 py-3 flex flex-col items-center text-center gap-1"
              >
                <span className="text-gold-500 text-sm">{s.icon}</span>
                <span className="text-white text-lg font-bold font-mono tabular-nums leading-none">{s.value}</span>
                <span className="text-gray-500 text-[10px] uppercase tracking-wide leading-tight">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Map */}
          <div className="relative rounded-xl border border-gold-500/10 bg-ink-950/60 overflow-hidden mb-4">
            <ComposableMap
              width={800}
              height={420}
              projectionConfig={{ scale: 128, center: [0, 12] }}
              className="w-full h-auto block"
            >
              <Sphere id="rsm-sphere" fill="#02070d" stroke="rgba(212,175,55,0.12)" strokeWidth={0.5} />
              <Graticule stroke="rgba(212,175,55,0.05)" strokeWidth={0.4} />
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#0e2a1d"
                      stroke="rgba(212,175,55,0.18)"
                      strokeWidth={0.4}
                      className="outline-none focus:outline-none"
                    />
                  ))
                }
              </Geographies>

              {stats?.markers.map((m, i) => {
                const r = markerRadius(m.count)
                return (
                  <Marker key={i} coordinates={[m.lng, m.lat]}>
                    <title>
                      {(m.city ? `${m.city}, ` : '') + m.country} — {formatNumber(m.count)}{' '}
                      {m.count === 1 ? 'visitor' : 'visitors'}
                    </title>
                    <circle r={r + 3} fill="#D4AF37" opacity={0.25} className="animate-ping" />
                    <circle r={r} fill="#D4AF37" stroke="#0e2a1d" strokeWidth={0.6} />
                  </Marker>
                )
              })}
            </ComposableMap>

            {!hasData && (
              <div className="absolute inset-0 flex items-center justify-center bg-ink-950/40 backdrop-blur-[1px] px-6">
                <p className="text-gray-300 text-xs text-center max-w-xs">
                  You&apos;re helping start this map — every new visitor from now on will appear here in real time.
                </p>
              </div>
            )}
          </div>

          {/* Top countries + live activity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto">
            <div>
              <p className="text-gray-500 text-[11px] uppercase tracking-wider mb-2 font-semibold">Top Countries</p>
              {stats && stats.topCountries.length > 0 ? (
                <div className="space-y-1.5">
                  {stats.topCountries.slice(0, 5).map((c) => {
                    const max = stats.topCountries[0]?.visitors || 1
                    const pct = Math.max(6, Math.round((c.visitors / max) * 100))
                    return (
                      <div key={c.countryCode} className="flex items-center gap-2">
                        <span className="text-sm shrink-0">{countryCodeToFlag(c.countryCode)}</span>
                        <span className="text-gray-300 text-xs truncate flex-1">{c.country}</span>
                        <div className="w-14 h-1.5 rounded-full bg-white/5 overflow-hidden shrink-0">
                          <div className="h-full bg-gold-500/70 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-gold-400 text-xs font-semibold font-mono tabular-nums w-6 text-right shrink-0">
                          {c.visitors}
                        </span>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-gray-600 text-xs">No countries yet.</p>
              )}
            </div>

            <div>
              <p className="text-gray-500 text-[11px] uppercase tracking-wider mb-2 font-semibold">Recent Activity</p>
              {stats && stats.recentVisitors.length > 0 ? (
                <div className="space-y-1.5">
                  {stats.recentVisitors.slice(0, 5).map((v, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <FaCircle className="text-green-400 text-[5px] shrink-0" />
                      <span className="text-gray-300 truncate flex-1">
                        {countryCodeToFlag(v.countryCode)} {v.city ? `${v.city}, ` : ''}
                        {v.country}
                      </span>
                      <span className="text-gray-600 shrink-0">{timeAgo(v.lastSeenAt)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-xs">No activity yet.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
