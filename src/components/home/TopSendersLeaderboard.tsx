'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'
import {
  FaCrown,
  FaMedal,
  FaChartBar,
  FaCalendarDay,
  FaCalendarWeek,
  FaCalendarAlt,
  FaUserCircle,
} from 'react-icons/fa'

interface LeaderEntry {
  name: string
  count: number
}

interface LeaderboardData {
  today: LeaderEntry[]
  weekly: LeaderEntry[]
  monthly: LeaderEntry[]
}

type RangeKey = 'today' | 'weekly' | 'monthly'

const RANGE_TABS: { key: RangeKey; label: string; icon: React.ReactNode }[] = [
  { key: 'today', label: 'Today', icon: <FaCalendarDay /> },
  { key: 'weekly', label: 'This Week', icon: <FaCalendarWeek /> },
  { key: 'monthly', label: 'This Month', icon: <FaCalendarAlt /> },
]

// Gold / silver / bronze presentation for ranks 1–3
const MEDAL_STYLE = [
  { badge: 'bg-gradient-to-br from-yellow-300 via-gold-400 to-gold-600 text-green-950', ring: 'ring-gold-400/60', icon: <FaCrown /> },
  { badge: 'bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 text-green-950', ring: 'ring-gray-300/40', icon: <FaMedal /> },
  { badge: 'bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 text-green-950', ring: 'ring-amber-500/40', icon: <FaMedal /> },
]

function formatNumber(n: number) {
  return new Intl.NumberFormat('en-US').format(n || 0)
}

function initials(name: string) {
  return (
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join('') || '?'
  )
}

function ChartTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) return null
  const p = payload[0].payload
  return (
    <div className="bg-[#0a120e] border border-gold-500/30 rounded-lg px-3 py-2 shadow-2xl">
      <p className="text-white text-xs font-semibold mb-0.5">{p.name}</p>
      <p className="text-gold-400 text-sm font-bold font-mono">{formatNumber(p.count)} Durood</p>
    </div>
  )
}

export default function TopSendersLeaderboard() {
  const [data, setData] = useState<LeaderboardData | null>(null)
  const [range, setRange] = useState<RangeKey>('today')

  useEffect(() => {
    const load = () => {
      fetch('/api/durood/stats')
        .then((res) => res.json())
        .then((json) => {
          if (json?.leaderboard) {
            setData({
              today: json.leaderboard.today || [],
              weekly: json.leaderboard.weekly || [],
              monthly: json.leaderboard.monthly || [],
            })
          }
        })
        .catch(() => {})
    }
    load()
    const interval = setInterval(load, 45000)
    return () => clearInterval(interval)
  }, [])

  const list = data ? data[range] : []
  const top3 = list.slice(0, 3)
  const rest = list.slice(3, 10)

  const chartData = useMemo(
    () => list.slice(0, 6).map((s) => ({ name: s.name, count: s.count })),
    [list]
  )

  return (
    <section
      className="py-20 sm:py-24 px-4"
      style={{ background: 'linear-gradient(to bottom, #071018, #02070d)' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 mb-5">
            <FaChartBar className="text-gold-500 text-xs" />
            <span className="text-gold-500 text-xs font-medium tracking-wider uppercase">
              Community Leaderboard
            </span>
          </div>
          <h2 className="text-gold-500 text-4xl md:text-5xl font-bold mb-4">
            Top Durood Senders
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Honouring those spreading the most blessings upon the Prophet ﷺ — ranked live.
          </p>
          <div className="mt-6 flex justify-center">
            <div className="w-24 h-[2px] bg-gold-500"></div>
          </div>
        </div>

        {/* Range tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center gap-1 bg-white/[0.03] border border-white/10 rounded-full p-1">
            {RANGE_TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setRange(t.key)}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                  range === t.key
                    ? 'bg-gold-500 text-green-950 shadow-lg shadow-gold-500/20'
                    : 'text-gray-400 hover:text-gold-400'
                }`}
              >
                <span className="text-xs">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {!data ? (
          <div className="grid lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 h-80 bg-white/[0.03] border border-white/10 rounded-2xl animate-pulse" />
            <div className="lg:col-span-3 h-80 bg-white/[0.03] border border-white/10 rounded-2xl animate-pulse" />
          </div>
        ) : list.length === 0 ? (
          <div className="text-center py-16 border border-white/10 rounded-2xl bg-white/[0.02]">
            <FaUserCircle className="text-gold-500/30 text-5xl mx-auto mb-4" />
            <p className="text-gray-400">
              No submissions in this period yet — be the first to top the board!
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-5 gap-6 items-start">
            {/* Podium + ranks 4-10 */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl px-4 pt-8 pb-6">
                <div className="grid grid-cols-3 gap-2 items-end">
                  {[1, 0, 2].map((idx) => {
                    const s = top3[idx]
                    const m = MEDAL_STYLE[idx]
                    if (!s) return <div key={idx} />
                    return (
                      <div
                        key={idx}
                        className={`flex flex-col items-center text-center ${
                          idx === 0 ? 'pt-0' : 'pt-6'
                        }`}
                      >
                        <div
                          className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full ${m.badge} ring-2 ${m.ring} flex items-center justify-center font-bold text-base sm:text-lg mb-2 shadow-lg`}
                        >
                          {initials(s.name)}
                          <span className="absolute -top-2 -right-1.5 text-xs sm:text-sm drop-shadow">
                            {m.icon}
                          </span>
                        </div>
                        <p className="text-white text-[11px] sm:text-sm font-semibold truncate max-w-[85px] sm:max-w-[100px]">
                          {s.name}
                        </p>
                        <p className="text-gold-400 text-[11px] sm:text-xs font-mono font-bold mt-0.5">
                          {formatNumber(s.count)}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>

              {rest.length > 0 && (
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl divide-y divide-white/5 overflow-hidden">
                  {rest.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between px-4 py-3 hover:bg-white/[0.03] transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-6 h-6 flex items-center justify-center rounded-full bg-white/5 text-gray-400 text-[11px] font-bold flex-shrink-0">
                          {i + 4}
                        </span>
                        <span className="text-gray-200 text-sm truncate">{s.name}</span>
                      </div>
                      <span className="text-gold-400 text-sm font-mono font-semibold flex-shrink-0">
                        {formatNumber(s.count)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Chart */}
            <div className="lg:col-span-3 bg-white/[0.03] border border-white/10 rounded-2xl p-5 sm:p-6">
              <h3 className="text-white font-semibold flex items-center gap-2 mb-6">
                <FaChartBar className="text-gold-500" /> Durood Sent — Top Contributors
              </h3>
              <div style={{ height: Math.max(chartData.length * 48, 200) }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ left: 0, right: 36, top: 0, bottom: 0 }}
                    barCategoryGap={16}
                  >
                    <defs>
                      <linearGradient id="leaderBarGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#a67f1a" />
                        <stop offset="100%" stopColor="#D4AF37" />
                      </linearGradient>
                    </defs>
                    <XAxis type="number" hide />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={110}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: '#d1d5db', fontSize: 12 }}
                    />
                    <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(212,175,55,0.05)' }} />
                    <Bar
                      dataKey="count"
                      radius={[0, 8, 8, 0]}
                      fill="url(#leaderBarGradient)"
                      maxBarSize={22}
                      label={{
                        position: 'right',
                        formatter: (v: number) => formatNumber(v),
                        fill: '#D4AF37',
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
