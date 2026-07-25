'use client'

import { useState, useEffect, type ReactNode } from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts'
import {
  FaHeart,
  FaMosque,
  FaChartLine,
  FaStar,
  FaCrown,
  FaUserFriends,
  FaCalendarDay,
  FaCalendarWeek,
  FaCalendarAlt,
  FaPaperPlane,
  FaSpinner,
  FaClock,
  FaListUl,
  FaQuran,
  FaBookOpen,
  FaTint,
  FaMoon,
  FaGem,
  FaEllipsisH
} from 'react-icons/fa'
import { DUROOD_CATEGORIES, DUROOD_CATEGORY_OTHER } from '@/constants/duroodCategories'

const CATEGORY_COLORS = ['#D4AF37', '#8BC34A', '#4FD1C5', '#F6C453']

// Icon shown on each category card — keyed by the exact category name so it
// lines up with DUROOD_CATEGORIES (and with whatever the stats API sends
// back in categoryBreakdown).
const CATEGORY_ICONS: Record<string, ReactNode> = {
  'Surah Yaseen': <FaBookOpen />,
  'Surah Rehman': <FaTint />,
  'Surah Mulk': <FaCrown />,
  'Surah Muzammil': <FaMoon />,
  'Complete Quran': <FaQuran />,
  'Durood e Taj': <FaGem />,
  'Durood': <FaHeart />,
  [DUROOD_CATEGORY_OTHER]: <FaEllipsisH />,
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null
  return (
    <div className="bg-green-950 border border-gold-500/30 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-gray-400 text-[10px] mb-1">{label}</p>
      <p className="text-gold-500 text-sm font-bold font-mono">
        {new Intl.NumberFormat('en-US').format(payload[0].value)}
      </p>
    </div>
  )
}

function formatNumber(n: number) {
  return new Intl.NumberFormat('en-US').format(n || 0)
}

function timeAgo(dateStr: string) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

interface Stats {
  total: number
  today: number
  week: number
  month: number
  totalSubmissions: number
  dailyTrend: { date: string; count: number }[]
  categoryBreakdown: { category: string; count: number }[]
  recentActivity: { name: string; count: number; type: string; createdAt: string }[]
  leaderboard: {
    weekly: { name: string; count: number }[]
    monthly: { name: string; count: number }[]
    allTime: { name: string; count: number }[]
  }
}

export default function DuroodCount() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  // Submission widget state
  const [name, setName] = useState('')
  const [count, setCount] = useState(33)
  const [category, setCategory] = useState<string>(DUROOD_CATEGORIES[6]) // "Durood" default
  const [otherCategory, setOtherCategory] = useState('')
  const [anonymous, setAnonymous] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [submitError, setSubmitError] = useState('')

  const loadStats = () => {
    fetch('/api/durood/stats')
      .then((res) => res.json())
      .then((data) => setStats(data))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadStats()
    const interval = setInterval(loadStats, 20000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError('')
    setSubmitMessage('')

    if (category === DUROOD_CATEGORY_OTHER && !otherCategory.trim()) {
      setSubmitError('Please tell us which Surah/Durood you recited.')
      return
    }
    const duroodType = category === DUROOD_CATEGORY_OTHER ? otherCategory.trim() : category

    setSubmitting(true)
    try {
      const res = await fetch('/api/durood/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: anonymous ? undefined : name || undefined,
          duroodCount: count,
          duroodType,
          isAnonymous: anonymous,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setSubmitError(data.error || 'Could not submit. Please try again.')
        return
      }
      setSubmitMessage(`Jazak Allah Khair! ${count.toLocaleString()} added to the global count.`)
      setCount(33)
      setCategory(DUROOD_CATEGORIES[6])
      setOtherCategory('')
      loadStats()
      setTimeout(() => setSubmitMessage(''), 4000)
    } catch {
      setSubmitError('Could not submit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const quickCounts = [1, 10, 33, 100, 1000]

  // Build the fixed set of category cards (Complete Quran, every Surah, the
  // Durood variants, and an aggregated "Other" bucket) from the live
  // categoryBreakdown — so a card always exists for each option in the
  // submission dropdown, even before anyone has submitted under it (shows 0).
  const categoryBreakdown = stats?.categoryBreakdown ?? []
  const categoryCountMap = new Map(categoryBreakdown.map((c) => [c.category, c.count]))
  const knownCategorySet = new Set<string>(DUROOD_CATEGORIES)
  const otherCategoryTotal = categoryBreakdown
    .filter((c) => !knownCategorySet.has(c.category))
    .reduce((sum, c) => sum + c.count, 0)
  const categoryCards = [
    ...DUROOD_CATEGORIES.map((cat) => ({ name: cat, count: categoryCountMap.get(cat) || 0 })),
    { name: DUROOD_CATEGORY_OTHER, count: otherCategoryTotal },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-950 via-green-900 to-green-950 py-16 px-4">
      <div className="max-w-6xl mx-auto">

        {/* ============================================
            HEADER
            ============================================ */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 mb-4">
            <FaChartLine className="text-gold-500 text-xs" />
            <span className="text-gold-500 text-xs font-medium tracking-wider">LIVE COUNTER</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
            Global <span className="text-gold-500">Durood</span> Count
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Every real submission from around the world, counted honestly and shown live.
          </p>
        </div>

        {/* ============================================
            SUBMISSION WIDGET
            ============================================ */}
        <div className="bg-green-850/80 border border-gold-500/20 rounded-2xl p-6 mb-10">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <FaHeart className="text-gold-500" /> Send Your Durood Count
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-xs block mb-1.5">Your Name (optional)</label>
                <input
                  type="text"
                  value={name}
                  disabled={anonymous}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Anonymous"
                  className="w-full px-3 py-2.5 bg-green-950 border border-gold-500/20 rounded-lg focus:border-gold-500 outline-none text-white text-sm transition disabled:opacity-50"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs flex items-center gap-1.5 mb-1.5">
                  <FaListUl className="text-gold-500/70 text-[10px]" /> Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="premium-select w-full px-3 py-2.5 bg-green-950 border border-gold-500/20 rounded-lg focus:border-gold-500 outline-none text-white text-sm transition"
                >
                  {DUROOD_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                  <option value={DUROOD_CATEGORY_OTHER}>{DUROOD_CATEGORY_OTHER} (specify below)</option>
                </select>
                {category === DUROOD_CATEGORY_OTHER && (
                  <input
                    type="text"
                    value={otherCategory}
                    onChange={(e) => setOtherCategory(e.target.value)}
                    placeholder="e.g. Surah Kahf, Durood-e-Ibrahimi..."
                    className="w-full mt-2 px-3 py-2.5 bg-green-950 border border-gold-500/20 rounded-lg focus:border-gold-500 outline-none text-white text-sm transition"
                  />
                )}
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-xs block mb-1.5">Count</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {quickCounts.map((qc) => (
                  <button
                    key={qc}
                    type="button"
                    onClick={() => setCount(qc)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      count === qc ? 'bg-gold-500 text-green-950' : 'bg-white/5 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    {qc}
                  </button>
                ))}
              </div>
              <input
                type="number"
                min={1}
                max={100000}
                value={count}
                onChange={(e) => setCount(Math.max(1, Math.min(100000, Number(e.target.value) || 1)))}
                className="w-full px-3 py-2.5 bg-green-950 border border-gold-500/20 rounded-lg focus:border-gold-500 outline-none text-white text-sm transition"
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
                className="rounded border-white/20 bg-white/5"
              />
              Submit anonymously
            </label>

            {submitError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded-lg px-3 py-2">
                {submitError}
              </div>
            )}
            {submitMessage && (
              <div className="bg-green-500/10 border border-green-500/30 text-green-300 text-sm rounded-lg px-3 py-2">
                {submitMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-600 disabled:opacity-60 text-green-950 font-bold px-6 py-2.5 rounded-lg transition"
            >
              {submitting ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
              {submitting ? 'Submitting...' : 'Submit Count'}
            </button>
          </form>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-500 text-sm">
            <FaSpinner className="animate-spin mr-2" /> Loading live stats...
          </div>
        ) : stats ? (
          <>
            {/* ============================================
                TOTALS
                ============================================ */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-green-850/80 border border-gold-500/20 rounded-2xl p-5 col-span-2 lg:col-span-1">
                <div className="flex items-center gap-2 mb-2 text-gold-500">
                  <FaMosque className="text-lg" />
                  <span className="text-gray-300 text-xs font-medium">All-Time Total</span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-gold-500 font-mono">{formatNumber(stats.total)}</div>
              </div>
              <div className="bg-green-850/80 border border-gold-500/20 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2 text-gold-500">
                  <FaCalendarDay className="text-sm" />
                  <span className="text-gray-300 text-xs font-medium">Today</span>
                </div>
                <div className="text-xl font-bold text-gold-500 font-mono">{formatNumber(stats.today)}</div>
              </div>
              <div className="bg-green-850/80 border border-gold-500/20 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2 text-gold-500">
                  <FaCalendarWeek className="text-sm" />
                  <span className="text-gray-300 text-xs font-medium">This Week</span>
                </div>
                <div className="text-xl font-bold text-gold-500 font-mono">{formatNumber(stats.week)}</div>
              </div>
              <div className="bg-green-850/80 border border-gold-500/20 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2 text-gold-500">
                  <FaCalendarAlt className="text-sm" />
                  <span className="text-gray-300 text-xs font-medium">This Month</span>
                </div>
                <div className="text-xl font-bold text-gold-500 font-mono">{formatNumber(stats.month)}</div>
              </div>
            </div>

            {/* ============================================
                CATEGORY COLLECTION — one card per Durood
                category (Complete Quran, every Surah, Durood
                variants, plus an aggregated "Other" card),
                each showing its own live total.
                ============================================ */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <FaStar className="text-gold-500" />
                <h3 className="text-white font-semibold">Durood Category Collection</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {categoryCards.map((c) => {
                  const isComplete = c.name === 'Complete Quran'
                  return (
                    <div
                      key={c.name}
                      className={`relative rounded-xl p-5 border transition-all duration-300 hover:-translate-y-1 ${
                        isComplete
                          ? 'bg-gradient-to-b from-gold-500/15 to-green-850/80 border-gold-500/40 shadow-[0_0_30px_rgba(212,175,55,0.1)]'
                          : 'bg-green-850/80 border-gold-500/20 hover:border-gold-500/40'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 text-lg ${
                        isComplete ? 'bg-gold-500/20 text-gold-400' : 'bg-gold-500/10 text-gold-500'
                      }`}>
                        {CATEGORY_ICONS[c.name] || <FaHeart />}
                      </div>
                      <div className="text-gray-300 text-xs font-medium mb-1 truncate" title={c.name}>
                        {c.name}
                      </div>
                      <div className={`font-mono font-bold ${isComplete ? 'text-gold-400 text-2xl' : 'text-gold-500 text-xl'}`}>
                        {formatNumber(c.count)}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* ============================================
                TREND + CATEGORY CHARTS
                ============================================ */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-green-850/80 border border-gold-500/20 rounded-xl p-5">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <FaChartLine className="text-gold-500" /> Last 30 Days
                </h3>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.dailyTrend}>
                      <defs>
                        <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.5} />
                          <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#D4AF37" strokeOpacity={0.08} />
                      <XAxis dataKey="date" stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false}
                        tickFormatter={(d) => new Date(d).getDate().toString()} />
                      <YAxis stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip content={<ChartTooltip />} />
                      <Area type="monotone" dataKey="count" stroke="#D4AF37" strokeWidth={2} fill="url(#trendGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-green-850/80 border border-gold-500/20 rounded-xl p-5">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <FaStar className="text-gold-500" /> By Category
                </h3>
                <div className="h-56">
                  {stats.categoryBreakdown.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-gray-500 text-sm">No submissions yet</div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.categoryBreakdown} layout="vertical" margin={{ left: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#D4AF37" strokeOpacity={0.08} horizontal={false} />
                        <XAxis type="number" stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis type="category" dataKey="category" stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} width={100} />
                        <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(212,175,55,0.06)' }} />
                        <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                          {stats.categoryBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>

            {/* ============================================
                RECENT ACTIVITY + LEADERBOARDS
                ============================================ */}
            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-green-850/80 border border-gold-500/20 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-gold-500/10 flex items-center gap-2">
                  <FaClock className="text-gold-500" />
                  <h3 className="text-white font-semibold">Recent Activity</h3>
                </div>
                <div className="p-4 space-y-3 max-h-72 overflow-y-auto scrollbar-hide">
                  {stats.recentActivity.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-6">No submissions yet — be the first!</p>
                  ) : (
                    stats.recentActivity.map((a, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <div className="min-w-0">
                          <p className="text-white truncate">{a.name}</p>
                          <p className="text-gray-500 text-[11px]">{a.type} · {timeAgo(a.createdAt)}</p>
                        </div>
                        <span className="text-gold-500 font-mono flex-shrink-0">+{formatNumber(a.count)}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-green-850/80 border border-gold-500/20 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-gold-500/10 flex items-center gap-2">
                  <FaCrown className="text-yellow-400" />
                  <h3 className="text-white font-semibold">Top This Month</h3>
                </div>
                <div className="p-4 space-y-2">
                  {stats.leaderboard.monthly.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-6">No submissions yet this month</p>
                  ) : (
                    stats.leaderboard.monthly.map((s, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-gold-500/5 transition">
                        <div className="flex items-center gap-3">
                          <span className={`flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold ${
                            i === 0 ? 'bg-yellow-400/20 text-yellow-400' :
                            i === 1 ? 'bg-gray-400/20 text-gray-300' :
                            i === 2 ? 'bg-amber-600/20 text-amber-500' : 'text-gray-500'
                          }`}>{i + 1}</span>
                          <span className="text-sm text-white truncate">{s.name}</span>
                        </div>
                        <span className="text-sm text-gold-500 font-mono">{formatNumber(s.count)}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-green-850/80 border border-gold-500/20 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-gold-500/10 flex items-center gap-2">
                  <FaUserFriends className="text-green-400" />
                  <h3 className="text-white font-semibold">Top This Week</h3>
                </div>
                <div className="p-4 space-y-2">
                  {stats.leaderboard.weekly.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-6">No submissions yet this week</p>
                  ) : (
                    stats.leaderboard.weekly.map((s, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-gold-500/5 transition">
                        <div className="flex items-center gap-3">
                          <span className={`flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold ${
                            i === 0 ? 'bg-yellow-400/20 text-yellow-400' :
                            i === 1 ? 'bg-gray-400/20 text-gray-300' :
                            i === 2 ? 'bg-amber-600/20 text-amber-500' : 'text-gray-500'
                          }`}>{i + 1}</span>
                          <span className="text-sm text-white truncate">{s.name}</span>
                        </div>
                        <span className="text-sm text-gold-500 font-mono">{formatNumber(s.count)}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </>
        ) : null}

        {/* ============================================
            QURAN VERSE FOOTER
            ============================================ */}
        <div className="bg-gold-500/10 border border-gold-500/20 rounded-xl p-6 text-center">
          <FaMosque className="text-gold-500 text-2xl mx-auto mb-2" />
          <p className="text-gray-300 text-sm">
            "The best of you are those who send the most blessings upon me."
            <span className="block text-gold-500 text-xs mt-1">— Prophet Muhammad ﷺ</span>
          </p>
        </div>

        <div className="mt-12 flex items-center justify-center gap-4">
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-gold-500/30"></div>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-gold-500/40"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-gold-500 shadow-lg shadow-gold-500/50"></div>
            <div className="w-1 h-1 rounded-full bg-gold-500/40"></div>
          </div>
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-gold-500/30"></div>
        </div>

        <div className="mt-3 text-center">
          <p className="text-[10px] text-gray-600 tracking-wider">
            <FaHeart className="inline mr-1.5 text-gold-500/30 text-[10px] animate-pulse" />
            Spreading blessings of Durood Shareef worldwide
          </p>
        </div>

      </div>
    </div>
  )
}
