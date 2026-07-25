'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { 
  FaUser, 
  FaHeart, 
  FaBook, 
  FaVideo, 
  FaHeadphones, 
  FaNewspaper, 
  FaQuestionCircle,
  FaChartLine,
  FaUsers,
  FaCalendarAlt,
  FaClock,
  FaCrown,
  FaFire,
  FaStar,
  FaCheckCircle,
  FaSpinner,
  FaSignOutAlt,
  FaCog,
  FaBell,
  FaSearch
} from 'react-icons/fa'
import { GiPrayer, GiBookCover } from 'react-icons/gi'
import { MdDashboard, MdMenuBook } from 'react-icons/md'

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalDurood: 0,
    totalResources: 0,
    totalSubmissions: 0,
    totalContributors: 0,
    contributorsThisWeek: 0,
    today: 0,
    week: 0,
    month: 0,
  })
  const [recentActivities, setRecentActivities] = useState<any[]>([])
  const [topUsers, setTopUsers] = useState<any[]>([])

  useEffect(() => {
    Promise.all([
      fetch('/api/dashboard/summary').then((r) => r.json()),
      fetch('/api/durood/stats').then((r) => r.json()),
    ])
      .then(([summary, duroodStats]) => {
        setStats({
          totalDurood: summary.totalDurood || 0,
          totalResources: summary.totalResources || 0,
          totalSubmissions: summary.totalSubmissions || 0,
          totalContributors: summary.totalContributors || 0,
          contributorsThisWeek: summary.contributorsThisWeek || 0,
          today: duroodStats.today || 0,
          week: duroodStats.week || 0,
          month: duroodStats.month || 0,
        })
        setRecentActivities(
          (duroodStats.recentActivity || []).map((a: any, i: number) => ({
            id: i,
            user: a.name,
            action: `submitted ${a.count.toLocaleString()} Durood (${a.type})`,
            time: new Date(a.createdAt).toLocaleString(),
            type: 'durood',
          }))
        )
        setTopUsers(
          (duroodStats.leaderboard?.allTime || []).map((u: any, i: number) => ({
            name: u.name,
            count: u.count,
            rank: i + 1,
          }))
        )
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-950 via-green-850 to-green-950 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="text-gold-500 text-4xl animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Loading Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-950 via-green-850 to-green-950 relative overflow-hidden">
      
      {/* ============================================
          PREMIUM BACKGROUND LAYERS
          ============================================ */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 80px, #D4AF37 80px, #D4AF37 81px),
            repeating-linear-gradient(90deg, transparent, transparent 80px, #D4AF37 80px, #D4AF37 81px),
            repeating-linear-gradient(45deg, transparent, transparent 160px, rgba(212, 175, 55, 0.3) 160px, rgba(212, 175, 55, 0.3) 161px),
            repeating-linear-gradient(-45deg, transparent, transparent 160px, rgba(212, 175, 55, 0.3) 160px, rgba(212, 175, 55, 0.3) 161px)
          `
        }} />
      </div>

      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundSize: '300px 300px'
      }} />

      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold-500/3 rounded-full blur-[150px]"></div>
      </div>

      {/* ============================================
          CONTENT
          ============================================ */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ============================================
            TITLE BAR
            ============================================ */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gold-500/5 rounded-2xl blur-2xl"></div>
          
          <div className="relative bg-gradient-to-r from-green-850/90 via-green-900/80 to-green-850/90 backdrop-blur-xl border border-gold-500/20 rounded-2xl overflow-hidden shadow-2xl shadow-gold-500/5">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-6 md:px-8 py-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gold-500/20 rounded-xl blur-lg"></div>
                  <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-gold-500/30 to-gold-500/10 border border-gold-500/30">
                    <MdDashboard className="text-gold-500 text-xl" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                    <span className="text-white">User</span>
                    <span className="text-gold-500"> Dashboard</span>
                  </h1>
                  <p className="text-gray-400 text-xs hidden sm:block">
                    Welcome back! Here's your activity overview
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gold-500/10 border border-gold-500/20 hover:bg-gold-500/20 transition">
                  <FaBell className="text-gold-500 text-xs" />
                  <span className="text-gray-300 text-xs font-medium">3 Notifications</span>
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gold-500/10 border border-gold-500/20 hover:bg-gold-500/20 transition">
                  <FaCog className="text-gold-500 text-xs" />
                  <span className="text-gray-300 text-xs font-medium">Settings</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================
            STATS CARDS - 6 COLUMN
            ============================================ */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {[
            { icon: <GiPrayer />, label: 'Total Durood', value: formatNumber(stats.totalDurood), color: '#D4AF37' },
            { icon: <FaUsers />, label: 'Contributors', value: formatNumber(stats.totalContributors), color: '#4ade80' },
            { icon: <MdMenuBook />, label: 'Resources', value: formatNumber(stats.totalResources), color: '#60a5fa' },
            { icon: <FaHeart />, label: 'Submissions', value: formatNumber(stats.totalSubmissions), color: '#f87171' },
            { icon: <FaChartLine />, label: 'Active This Week', value: formatNumber(stats.contributorsThisWeek), color: '#a78bfa' }
          ].map((item, i) => (
            <div key={i} className="bg-green-850/80 border border-gold-500/20 rounded-xl p-4 text-center hover:border-gold-500/40 transition-all hover:-translate-y-1">
              <div className="text-2xl flex justify-center mb-1" style={{ color: item.color }}>
                {item.icon}
              </div>
              <div className="text-lg font-bold text-white">{item.value}</div>
              <div className="text-gray-400 text-[10px]">{item.label}</div>
            </div>
          ))}
        </div>

        {/* ============================================
            SECOND ROW - REAL PERIOD TOTALS
            ============================================ */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-green-850/80 border border-gold-500/20 rounded-xl p-5 hover:border-gold-500/40 transition-all">
            <h3 className="text-white font-semibold text-sm mb-3">Today</h3>
            <p className="text-2xl font-black text-gold-500 font-mono">{formatNumber(stats.today)}</p>
            <p className="text-gray-500 text-xs mt-1">Durood sent today</p>
          </div>

          <div className="bg-green-850/80 border border-gold-500/20 rounded-xl p-5 hover:border-gold-500/40 transition-all">
            <h3 className="text-white font-semibold text-sm mb-3">This Week</h3>
            <p className="text-2xl font-black text-gold-500 font-mono">{formatNumber(stats.week)}</p>
            <p className="text-gray-500 text-xs mt-1">Durood sent this week</p>
          </div>

          {/* Quick Stats */}
          <div className="bg-green-850/80 border border-gold-500/20 rounded-xl p-5 hover:border-gold-500/40 transition-all">
            <h3 className="text-white font-semibold text-sm mb-3">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs">This Month</span>
                <span className="text-white font-bold text-sm">{formatNumber(stats.month)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs">Total Resources</span>
                <span className="text-white font-bold text-sm">{formatNumber(stats.totalResources)}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gold-500/10">
                <span className="text-gray-400 text-xs">Active This Week</span>
                <span className="text-gold-500 font-bold text-sm">{formatNumber(stats.contributorsThisWeek)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================
            THIRD ROW - ACTIVITY & TOP USERS
            ============================================ */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-green-850/80 border border-gold-500/20 rounded-xl overflow-hidden hover:border-gold-500/40 transition-all">
            <div className="px-5 py-4 border-b border-gold-500/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FaFire className="text-gold-500 text-sm" />
                <h3 className="text-white font-semibold">Recent Activity</h3>
              </div>
              <span className="text-[10px] text-gray-500">Live</span>
            </div>
            <div className="p-4 space-y-3 max-h-[280px] overflow-y-auto scrollbar-hide">
              {recentActivities.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-6">No activity yet — be the first to send Durood!</p>
              ) : recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gold-500/5 transition">
                  <div className={`p-1.5 rounded-lg ${
                    activity.type === 'durood' ? 'bg-gold-500/20' :
                    activity.type === 'user' ? 'bg-blue-500/20' :
                    activity.type === 'resource' ? 'bg-green-500/20' :
                    activity.type === 'question' ? 'bg-yellow-500/20' :
                    activity.type === 'audio' ? 'bg-purple-500/20' :
                    'bg-red-500/20'
                  }`}>
                    {activity.type === 'durood' && <GiPrayer className="text-gold-500 text-xs" />}
                    {activity.type === 'user' && <FaUser className="text-blue-400 text-xs" />}
                    {activity.type === 'resource' && <FaBook className="text-green-400 text-xs" />}
                    {activity.type === 'question' && <FaQuestionCircle className="text-yellow-400 text-xs" />}
                    {activity.type === 'audio' && <FaHeadphones className="text-purple-400 text-xs" />}
                    {activity.type === 'video' && <FaVideo className="text-red-400 text-xs" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white">
                      <span className="font-semibold">{activity.user}</span>
                      <span className="text-gray-400"> {activity.action}</span>
                    </p>
                    <p className="text-[10px] text-gray-500">{activity.time}</p>
                  </div>
                  <FaCheckCircle className="text-green-400 text-xs mt-1" />
                </div>
              ))}
            </div>
          </div>

          {/* Top Users */}
          <div className="bg-green-850/80 border border-gold-500/20 rounded-xl overflow-hidden hover:border-gold-500/40 transition-all">
            <div className="px-5 py-4 border-b border-gold-500/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FaCrown className="text-yellow-400 text-sm" />
                <h3 className="text-white font-semibold">Top Contributors</h3>
              </div>
              <span className="text-[10px] text-gray-500">All Time</span>
            </div>
            <div className="p-4 space-y-3">
              {topUsers.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-6">No contributors yet</p>
              ) : topUsers.map((user) => (
                <div key={user.rank} className="flex items-center justify-between p-2 rounded-lg hover:bg-gold-500/5 transition">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold w-5 ${
                      user.rank === 1 ? 'text-yellow-400' :
                      user.rank === 2 ? 'text-gray-400' :
                      user.rank === 3 ? 'text-amber-600' :
                      'text-gray-500'
                    }`}>
                      #{user.rank}
                    </span>
                    <span className="text-sm text-white">{user.name}</span>
                    {user.rank === 1 && <FaStar className="text-yellow-400 text-[10px]" />}
                  </div>
                  <span className="text-sm text-gold-500 font-mono">{formatNumber(user.count)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ============================================
            BOTTOM DECORATION
            ============================================ */}
        <div className="mt-12 flex items-center justify-center gap-4">
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-gold-500/30"></div>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-gold-500/40"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-gold-500 shadow-lg shadow-gold-500/50"></div>
            <div className="w-1 h-1 rounded-full bg-gold-500/40"></div>
          </div>
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-gold-500/30"></div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-[10px] text-gray-600 tracking-wider">
            <FaHeart className="inline mr-1.5 text-gold-500/30 text-[10px] animate-pulse" />
            Your journey of spreading blessings, one Durood at a time
          </p>
        </div>

      </div>
    </div>
  )
}

// ============================================
// UTILITY FUNCTION
// ============================================
function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}