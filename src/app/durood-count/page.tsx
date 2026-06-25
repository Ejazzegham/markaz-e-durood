'use client'

import { useState, useEffect } from 'react'
import { 
  FaHeart, 
  FaUsers, 
  FaGlobe, 
  FaMosque, 
  FaChartLine,
  FaStar,
  FaCrown,
  FaUserFriends,
  FaBookOpen,
  FaQuran,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa'

export default function DuroodCount() {
  // ============================================
  // STATE
  // ============================================
  const [totalDurood, setTotalDurood] = useState(994766335928)
  const [totalQuran, setTotalQuran] = useState(0)
  const [totalSurahYaseen, setTotalSurahYaseen] = useState(0)
  const [totalSurahRehman, setTotalSurahRehman] = useState(0)
  const [totalSurahMuzamal, setTotalSurahMuzamal] = useState(0)
  const [activeUsers, setActiveUsers] = useState(0)
  const [blessingsShared, setBlessingsShared] = useState(0)
  const [totalCountries, setTotalCountries] = useState(0)
  
  // Chart data states
  const [monthlyTopSenders, setMonthlyTopSenders] = useState<any[]>([])
  const [weeklyTopSenders, setWeeklyTopSenders] = useState<any[]>([])
  const [currentMonth, setCurrentMonth] = useState('')
  const [currentWeek, setCurrentWeek] = useState('')

  // ============================================
  // GENERATE DUMMY DATA
  // ============================================
  useEffect(() => {
    // Simulate live counter updates
    const interval = setInterval(() => {
      setTotalDurood(prev => prev + Math.floor(Math.random() * 100) + 10)
      setTotalQuran(prev => prev + Math.floor(Math.random() * 5) + 1)
      setTotalSurahYaseen(prev => prev + Math.floor(Math.random() * 10) + 2)
      setTotalSurahRehman(prev => prev + Math.floor(Math.random() * 8) + 1)
      setTotalSurahMuzamal(prev => prev + Math.floor(Math.random() * 6) + 1)
      setActiveUsers(prev => prev + Math.floor(Math.random() * 3))
      setBlessingsShared(prev => prev + Math.floor(Math.random() * 50) + 10)
      setTotalCountries(100 + Math.floor(Math.random() * 20))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Generate dummy leaderboard data
  useEffect(() => {
    const names = [
      'Muhammad Ali', 'Ahmed Khan', 'Fatima Zahra', 'Omar Farooq', 
      'Ayesha Malik', 'Hassan Raza', 'Zainab Bibi', 'Abdullah Noor',
      'Sara Ahmed', 'Usman Ghani', 'Khadija Hassan', 'Yusuf Islam'
    ]
    
    // Monthly top senders
    const monthly = names.map((name, i) => ({
      name,
      count: Math.floor(Math.random() * 50000) + 10000,
      rank: i + 1,
      trend: Math.random() > 0.5 ? 'up' : 'down'
    })).sort((a, b) => b.count - a.count)
    
    setMonthlyTopSenders(monthly.slice(0, 10))
    
    // Weekly top senders
    const weekly = names.map((name, i) => ({
      name,
      count: Math.floor(Math.random() * 10000) + 1000,
      rank: i + 1,
      trend: Math.random() > 0.5 ? 'up' : 'down'
    })).sort((a, b) => b.count - a.count)
    
    setWeeklyTopSenders(weekly.slice(0, 10))
    
    // Set current month and week
    const now = new Date()
    setCurrentMonth(now.toLocaleString('default', { month: 'long', year: 'numeric' }))
    setCurrentWeek(`Week ${Math.ceil((now.getDate() - now.getDay() + 1) / 7)} - ${now.toLocaleString('default', { month: 'long' })}`)
  }, [])

  // ============================================
  // FORMAT NUMBER
  // ============================================
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
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
          TITLE BAR
          ============================================ */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative mb-10">
          <div className="absolute inset-0 bg-[#D4AF37]/5 rounded-2xl blur-2xl"></div>
          
          <div className="relative bg-gradient-to-r from-[#112c1b]/90 via-[#1a4d2e]/80 to-[#112c1b]/90 backdrop-blur-xl border border-[#D4AF37]/20 rounded-2xl overflow-hidden shadow-2xl shadow-[#D4AF37]/5">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-6 md:px-8 py-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#D4AF37]/20 rounded-xl blur-lg"></div>
                  <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-[#D4AF37]/30 to-[#D4AF37]/10 border border-[#D4AF37]/30">
                    <FaChartLine className="text-[#D4AF37] text-xl" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                    <span className="text-white">Durood</span>
                    <span className="text-[#D4AF37]"> Count</span>
                  </h1>
                  <p className="text-gray-400 text-xs hidden sm:block">
                    Live count of Durood Shareef submitted worldwide
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                  <FaHeart className="text-[#D4AF37] text-xs animate-pulse" />
                  <span className="text-gray-300 text-xs font-medium">Live Updates</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================
            STATS GRID - 4 COLUMN
            ============================================ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Durood */}
          <div className="bg-[#112c1b]/80 border border-[#D4AF37]/20 rounded-xl p-5 hover:border-[#D4AF37]/40 transition-all hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                <FaHeart className="text-[#D4AF37] text-lg" />
              </div>
              <span className="text-gray-400 text-xs font-medium">Total Durood</span>
            </div>
            <div className="text-2xl font-bold text-[#D4AF37] font-mono">
              {formatNumber(totalDurood)}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-gray-500 text-[10px]">Live</span>
            </div>
          </div>

          {/* Total Quran */}
          <div className="bg-[#112c1b]/80 border border-[#D4AF37]/20 rounded-xl p-5 hover:border-[#D4AF37]/40 transition-all hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                <FaQuran className="text-[#D4AF37] text-lg" />
              </div>
              <span className="text-gray-400 text-xs font-medium">Total Quran</span>
            </div>
            <div className="text-2xl font-bold text-[#D4AF37] font-mono">
              {formatNumber(totalQuran)}
            </div>
          </div>

          {/* Surah Yaseen */}
          <div className="bg-[#112c1b]/80 border border-[#D4AF37]/20 rounded-xl p-5 hover:border-[#D4AF37]/40 transition-all hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                <FaBookOpen className="text-[#D4AF37] text-lg" />
              </div>
              <span className="text-gray-400 text-xs font-medium">Surah Yaseen</span>
            </div>
            <div className="text-2xl font-bold text-[#D4AF37] font-mono">
              {formatNumber(totalSurahYaseen)}
            </div>
          </div>

          {/* Surah Rehman */}
          <div className="bg-[#112c1b]/80 border border-[#D4AF37]/20 rounded-xl p-5 hover:border-[#D4AF37]/40 transition-all hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                <FaBookOpen className="text-[#D4AF37] text-lg" />
              </div>
              <span className="text-gray-400 text-xs font-medium">Surah Rehman</span>
            </div>
            <div className="text-2xl font-bold text-[#D4AF37] font-mono">
              {formatNumber(totalSurahRehman)}
            </div>
          </div>
        </div>

        {/* ============================================
            SECOND STATS ROW
            ============================================ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Surah Muzamal */}
          <div className="bg-[#112c1b]/80 border border-[#D4AF37]/20 rounded-xl p-5 hover:border-[#D4AF37]/40 transition-all hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                <FaBookOpen className="text-[#D4AF37] text-lg" />
              </div>
              <span className="text-gray-400 text-xs font-medium">Surah Muzamal</span>
            </div>
            <div className="text-2xl font-bold text-[#D4AF37] font-mono">
              {formatNumber(totalSurahMuzamal)}
            </div>
          </div>

          {/* Active Users */}
          <div className="bg-[#112c1b]/80 border border-[#D4AF37]/20 rounded-xl p-5 hover:border-[#D4AF37]/40 transition-all hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                <FaUsers className="text-[#D4AF37] text-lg" />
              </div>
              <span className="text-gray-400 text-xs font-medium">Active Users</span>
            </div>
            <div className="text-2xl font-bold text-[#D4AF37] font-mono">
              {formatNumber(activeUsers)}
            </div>
          </div>

          {/* Blessings Shared */}
          <div className="bg-[#112c1b]/80 border border-[#D4AF37]/20 rounded-xl p-5 hover:border-[#D4AF37]/40 transition-all hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                <FaStar className="text-[#D4AF37] text-lg" />
              </div>
              <span className="text-gray-400 text-xs font-medium">Blessings Shared</span>
            </div>
            <div className="text-2xl font-bold text-[#D4AF37] font-mono">
              {formatNumber(blessingsShared)}
            </div>
          </div>

          {/* Total Countries */}
          <div className="bg-[#112c1b]/80 border border-[#D4AF37]/20 rounded-xl p-5 hover:border-[#D4AF37]/40 transition-all hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                <FaGlobe className="text-[#D4AF37] text-lg" />
              </div>
              <span className="text-gray-400 text-xs font-medium">Countries</span>
            </div>
            <div className="text-2xl font-bold text-[#D4AF37] font-mono">
              {formatNumber(totalCountries)}
            </div>
          </div>
        </div>

        {/* ============================================
            LEADERBOARD SECTION
            ============================================ */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Top Senders */}
          <div className="bg-[#112c1b]/80 border border-[#D4AF37]/20 rounded-xl overflow-hidden hover:border-[#D4AF37]/40 transition-all">
            <div className="px-5 py-4 border-b border-[#D4AF37]/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FaCrown className="text-yellow-400" />
                <h3 className="text-white font-semibold">Top Monthly Senders</h3>
              </div>
              <span className="text-[10px] text-gray-500">{currentMonth}</span>
            </div>
            <div className="p-4 space-y-2">
              {monthlyTopSenders.map((sender) => (
                <div key={sender.rank} className="flex items-center justify-between p-2 rounded-lg hover:bg-[#D4AF37]/5 transition">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold w-5 ${
                      sender.rank === 1 ? 'text-yellow-400' :
                      sender.rank === 2 ? 'text-gray-400' :
                      sender.rank === 3 ? 'text-amber-600' :
                      'text-gray-500'
                    }`}>
                      #{sender.rank}
                    </span>
                    <span className="text-sm text-white">{sender.name}</span>
                    {sender.trend === 'up' ? (
                      <FaArrowUp className="text-green-400 text-[10px]" />
                    ) : (
                      <FaArrowDown className="text-red-400 text-[10px]" />
                    )}
                  </div>
                  <span className="text-sm text-[#D4AF37] font-mono">{formatNumber(sender.count)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Top Senders */}
          <div className="bg-[#112c1b]/80 border border-[#D4AF37]/20 rounded-xl overflow-hidden hover:border-[#D4AF37]/40 transition-all">
            <div className="px-5 py-4 border-b border-[#D4AF37]/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FaUserFriends className="text-green-400" />
                <h3 className="text-white font-semibold">Top Weekly Senders</h3>
              </div>
              <span className="text-[10px] text-gray-500">{currentWeek}</span>
            </div>
            <div className="p-4 space-y-2">
              {weeklyTopSenders.map((sender) => (
                <div key={sender.rank} className="flex items-center justify-between p-2 rounded-lg hover:bg-[#D4AF37]/5 transition">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold w-5 ${
                      sender.rank === 1 ? 'text-yellow-400' :
                      sender.rank === 2 ? 'text-gray-400' :
                      sender.rank === 3 ? 'text-amber-600' :
                      'text-gray-500'
                    }`}>
                      #{sender.rank}
                    </span>
                    <span className="text-sm text-white">{sender.name}</span>
                    {sender.trend === 'up' ? (
                      <FaArrowUp className="text-green-400 text-[10px]" />
                    ) : (
                      <FaArrowDown className="text-red-400 text-[10px]" />
                    )}
                  </div>
                  <span className="text-sm text-[#D4AF37] font-mono">{formatNumber(sender.count)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ============================================
            QURAN VERSE FOOTER
            ============================================ */}
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6 text-center">
          <FaMosque className="text-[#D4AF37] text-2xl mx-auto mb-2" />
          <p className="text-gray-300 text-sm">
            "The best of you are those who send the most blessings upon me." 
            <span className="block text-[#D4AF37] text-xs mt-1">— Prophet Muhammad ﷺ</span>
          </p>
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

        <div className="mt-3 text-center">
          <p className="text-[10px] text-gray-600 tracking-wider">
            <FaHeart className="inline mr-1.5 text-[#D4AF37]/30 text-[10px] animate-pulse" />
            Spreading blessings of Durood Shareef worldwide
          </p>
        </div>

      </div>
    </div>
  )
}