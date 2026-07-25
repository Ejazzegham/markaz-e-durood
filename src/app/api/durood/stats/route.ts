import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db/firestore'

function startOfDay(d: Date) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}
function startOfWeek(d: Date) {
  const x = startOfDay(d)
  const day = x.getDay() // 0 = Sunday
  x.setDate(x.getDate() - day)
  return x
}
function startOfMonth(d: Date) {
  const x = startOfDay(d)
  x.setDate(1)
  return x
}

interface SubmissionRow {
  userName: string
  duroodCount: number
  duroodType: string | null
  isAnonymous: boolean
  createdAt: Date
}

// Firestore has no server-side SUM/GROUP BY like SQL, so all the counter's
// aggregates (totals, trend, leaderboards) are computed here in memory from
// every approved submission. That's the simplest correct approach and is
// plenty fast at this site's scale; if submission volume grows very large,
// swap this for running totals maintained by a Cloud Function trigger
// instead of reading every row on each request.
export async function GET() {
  try {
    const now = new Date()
    const todayStart = startOfDay(now)
    const weekStart = startOfWeek(now)
    const monthStart = startOfMonth(now)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const db = getDb()
    const snap = await db
      .collection('duroodSubmissions')
      .where('status', '==', 'APPROVED')
      .select('userName', 'duroodCount', 'duroodType', 'isAnonymous', 'createdAt')
      .get()

    const rows: SubmissionRow[] = snap.docs.map((doc) => {
      const d = doc.data()
      return {
        userName: d.userName,
        duroodCount: d.duroodCount,
        duroodType: d.duroodType || null,
        isAnonymous: !!d.isAnonymous,
        createdAt: d.createdAt.toDate(),
      }
    })

    const sumSince = (since: Date | null) =>
      rows.reduce((sum, r) => (!since || r.createdAt >= since ? sum + r.duroodCount : sum), 0)

    const total = sumSince(null)
    const today = sumSince(todayStart)
    const week = sumSince(weekStart)
    const month = sumSince(monthStart)
    const totalSubmissions = rows.length

    // Bucket the last 30 days of submissions into a daily trend
    const trendMap = new Map<string, number>()
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      trendMap.set(d.toISOString().slice(0, 10), 0)
    }
    for (const r of rows) {
      if (r.createdAt < thirtyDaysAgo) continue
      const key = r.createdAt.toISOString().slice(0, 10)
      if (trendMap.has(key)) trendMap.set(key, (trendMap.get(key) || 0) + r.duroodCount)
    }
    const dailyTrend = Array.from(trendMap.entries()).map(([date, count]) => ({ date, count }))

    const categoryMap = new Map<string, number>()
    for (const r of rows) {
      const key = r.duroodType || 'General'
      categoryMap.set(key, (categoryMap.get(key) || 0) + r.duroodCount)
    }
    const categoryBreakdown = Array.from(categoryMap.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)

    const recentActivity = [...rows]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 10)
      .map((r) => ({
        name: r.isAnonymous ? 'Anonymous' : r.userName,
        count: r.duroodCount,
        type: r.duroodType || 'General',
        createdAt: r.createdAt,
      }))

    const buildLeaderboard = (since: Date | null) => {
      const map = new Map<string, number>()
      for (const r of rows) {
        if (r.isAnonymous) continue
        if (since && r.createdAt < since) continue
        map.set(r.userName, (map.get(r.userName) || 0) + r.duroodCount)
      }
      return Array.from(map.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)
    }

    return NextResponse.json({
      total,
      today,
      week,
      month,
      totalSubmissions,
      dailyTrend,
      categoryBreakdown,
      recentActivity,
      leaderboard: {
        weekly: buildLeaderboard(weekStart),
        monthly: buildLeaderboard(monthStart),
        allTime: buildLeaderboard(null),
      },
    })
  } catch (error) {
    console.error('Durood stats error:', error)
    return NextResponse.json({ error: 'Something went wrong loading stats.' }, { status: 500 })
  }
}
