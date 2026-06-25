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
  FaGlobe,
  FaCalendarAlt,
  FaClock,
  FaArrowUp,
  FaArrowDown,
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
    totalUsers: 0,
    totalResources: 0,
    totalSubmissions: 0,
    totalCountries: 0,
    activeUsers: 0,
    monthlyGrowth: 0,
    weeklyGrowth: 0
  })

  // Simulate loading data
  useEffect(() => {
    setTimeout(() => {
      setStats({
        totalDurood: 994766335928,
        totalUsers: 10234,
        totalResources: 856,
        totalSubmissions: 4521,
        totalCountries: 108,
        activeUsers: 3421,
        monthlyGrowth: 12.5,
        weeklyGrowth: 8.3
      })
      setLoading(false)
    }, 1500)
  }, [])

  // Recent activity data
  const recentActivities = [
    { id: 1, user: 'Muhammad Ali', action: 'submitted 1,500 Durood', time: '2 min ago', type: 'durood' },
    { id: 2, user: 'Fatima Zahra', action: 'registered new account', time: '15 min ago', type: 'user' },
    { id: 3, user: 'Ahmed Khan', action: 'downloaded 3 PDF books', time: '1 hour ago', type: 'resource' },
    { id: 4, user: 'Ayesha Malik', action: 'submitted a new question', time: '2 hours ago', type: 'question' },
    { id: 5, user: 'Omar Farooq', action: 'listened to 5 audio recitations', time: '3 hours ago', type: 'audio' },
    { id: 6, user: 'Hassan Raza', action: 'watched 2 Bayan videos', time: '5 hours ago', type: 'video' },
    { id: 7, user: 'Zainab Bibi', action: 'shared 100 Durood blessings', time: '6 hours ago', type: 'durood' }
  ]

  // Top users data
  const topUsers = [
    { name: 'Muhammad Ali', count: 15200, rank: 1 },
    { name: 'Ahmed Khan', count: 12300, rank: 2 },
    { name: 'Fatima Zahra', count: 10900, rank: 3 },
    { name: 'Omar Farooq', count: 8700, rank: 4 },
    { name: 'Ayesha Malik', count: 7600, rank: 5 }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a1a10] via-[#112c1b] to-[#0a1a10] flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="text-[#D4AF37] text-4xl animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Loading Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1a10] via-[#112c1b] to-[#0a1a10] relative overflow-hidden">
      
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
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D4AF37]/3 rounded-full blur-[150px]"></div>
      </div>

      {/* ============================================
          CONTENT
          ============================================ */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ============================================
            TITLE BAR
            ============================================ */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-[#D4AF37]/5 rounded-2xl blur-2xl"></div>
          
          <div className="relative bg-gradient-to-r from-[#112c1b]/90 via-[#1a4d2e]/80 to-[#112c1b]/90 backdrop-blur-xl border border-[#D4AF37]/20 rounded-2xl overflow-hidden shadow-2xl shadow-[#D4AF37]/5">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-6 md:px-8 py-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#D4AF37]/20 rounded-xl blur-lg"></div>
                  <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-[#D4AF37]/30 to-[#D4AF37]/10 border border-[#D4AF37]/30">
                    <MdDashboard className="text-[#D4AF37] text-xl" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                    <span className="text-white">User</span>
                    <span className="text-[#D4AF37]"> Dashboard</span>
                  </h1>
                  <p className="text-gray-400 text-xs hidden sm:block">
                    Welcome back! Here's your activity overview
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 hover:bg-[#D4AF37]/20 transition">
                  <FaBell className="text-[#D4AF37] text-xs" />
                  <span className="text-gray-300 text-xs font-medium">3 Notifications</span>
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 hover:bg-[#D4AF37]/20 transition">
                  <FaCog className="text-[#D4AF37] text-xs" />
                  <span className="text-gray-300 text-xs font-medium">Settings</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================
            STATS CARDS - 6 COLUMN
            ============================================ */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            { icon: <GiPrayer />, label: 'Total Durood', value: formatNumber(stats.totalDurood), color: '#D4AF37' },
            { icon: <FaUsers />, label: 'Total Users', value: formatNumber(stats.totalUsers), color: '#4ade80' },
            { icon: <MdMenuBook />, label: 'Resources', value: formatNumber(stats.totalResources), color: '#60a5fa' },
            { icon: <FaHeart />, label: 'Submissions', value: formatNumber(stats.totalSubmissions), color: '#f87171' },
            { icon: <FaGlobe />, label: 'Countries', value: formatNumber(stats.totalCountries), color: '#fbbf24' },
            { icon: <FaChartLine />, label: 'Active Users', value: formatNumber(stats.activeUsers), color: '#a78bfa' }
          ].map((item, i) => (
            <div key={i} className="bg-[#112c1b]/80 border border-[#D4AF37]/20 rounded-xl p-4 text-center hover:border-[#D4AF37]/40 transition-all hover:-translate-y-1">
              <div className="text-2xl flex justify-center mb-1" style={{ color: item.color }}>
                {item.icon}
              </div>
              <div className="text-lg font-bold text-white">{item.value}</div>
              <div className="text-gray-400 text-[10px]">{item.label}</div>
            </div>
          ))}
        </div>

        {/* ============================================
            SECOND ROW - GROWTH & CHART
            ============================================ */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Weekly Growth */}
          <div className="bg-[#112c1b]/80 border border-[#D4AF37]/20 rounded-xl p-5 hover:border-[#D4AF37]/40 transition-all">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold text-sm">Weekly Growth</h3>
              <div className="flex items-center gap-1 text-green-400 text-xs">
                <FaArrowUp /> {stats.weeklyGrowth}%
              </div>
            </div>
            <div className="flex items-end gap-1 h-20">
              {[40, 55, 45, 70, 60, 85, 75].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-[#D4AF37] rounded-t transition-all duration-500 hover:opacity-80"
                    style={{ height: `${height}%` }}
                  ></div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-gray-500">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>

          {/* Monthly Growth */}
          <div className="bg-[#112c1b]/80 border border-[#D4AF37]/20 rounded-xl p-5 hover:border-[#D4AF37]/40 transition-all">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold text-sm">Monthly Growth</h3>
              <div className="flex items-center gap-1 text-green-400 text-xs">
                <FaArrowUp /> {stats.monthlyGrowth}%
              </div>
            </div>
            <div className="flex items-end gap-1 h-20">
              {[30, 45, 55, 40, 65, 75, 85, 70, 90, 80, 95, 100].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-[#D4AF37] rounded-t transition-all duration-500 hover:opacity-80"
                    style={{ height: `${height * 0.6}%` }}
                  ></div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-gray-500">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
              <span>Dec</span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-[#112c1b]/80 border border-[#D4AF37]/20 rounded-xl p-5 hover:border-[#D4AF37]/40 transition-all">
            <h3 className="text-white font-semibold text-sm mb-3">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs">Today's Submissions</span>
                <span className="text-white font-bold text-sm">342</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs">This Week</span>
                <span className="text-white font-bold text-sm">2,451</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs">This Month</span>
                <span className="text-white font-bold text-sm">9,876</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs">Total Resources</span>
                <span className="text-white font-bold text-sm">{formatNumber(stats.totalResources)}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[#D4AF37]/10">
                <span className="text-gray-400 text-xs">Active Users</span>
                <span className="text-[#D4AF37] font-bold text-sm">{formatNumber(stats.activeUsers)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================
            THIRD ROW - ACTIVITY & TOP USERS
            ============================================ */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-[#112c1b]/80 border border-[#D4AF37]/20 rounded-xl overflow-hidden hover:border-[#D4AF37]/40 transition-all">
            <div className="px-5 py-4 border-b border-[#D4AF37]/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FaFire className="text-[#D4AF37] text-sm" />
                <h3 className="text-white font-semibold">Recent Activity</h3>
              </div>
              <span className="text-[10px] text-gray-500">Live</span>
            </div>
            <div className="p-4 space-y-3 max-h-[280px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#D4AF37]/20">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-[#D4AF37]/5 transition">
                  <div className={`p-1.5 rounded-lg ${
                    activity.type === 'durood' ? 'bg-[#D4AF37]/20' :
                    activity.type === 'user' ? 'bg-blue-500/20' :
                    activity.type === 'resource' ? 'bg-green-500/20' :
                    activity.type === 'question' ? 'bg-yellow-500/20' :
                    activity.type === 'audio' ? 'bg-purple-500/20' :
                    'bg-red-500/20'
                  }`}>
                    {activity.type === 'durood' && <GiPrayer className="text-[#D4AF37] text-xs" />}
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
          <div className="bg-[#112c1b]/80 border border-[#D4AF37]/20 rounded-xl overflow-hidden hover:border-[#D4AF37]/40 transition-all">
            <div className="px-5 py-4 border-b border-[#D4AF37]/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FaCrown className="text-yellow-400 text-sm" />
                <h3 className="text-white font-semibold">Top Contributors</h3>
              </div>
              <span className="text-[10px] text-gray-500">This Month</span>
            </div>
            <div className="p-4 space-y-3">
              {topUsers.map((user) => (
                <div key={user.rank} className="flex items-center justify-between p-2 rounded-lg hover:bg-[#D4AF37]/5 transition">
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
                  <span className="text-sm text-[#D4AF37] font-mono">{formatNumber(user.count)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ============================================
            BOTTOM DECORATION
            ============================================ */}
        <div className="mt-12 flex items-center justify-center gap-4">
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#D4AF37]/30"></div>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-[#D4AF37]/40"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-lg shadow-[#D4AF37]/50"></div>
            <div className="w-1 h-1 rounded-full bg-[#D4AF37]/40"></div>
          </div>
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#D4AF37]/30"></div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-[10px] text-gray-600 tracking-wider">
            <FaHeart className="inline mr-1.5 text-[#D4AF37]/30 text-[10px] animate-pulse" />
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