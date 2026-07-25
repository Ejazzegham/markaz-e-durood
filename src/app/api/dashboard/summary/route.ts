import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db/firestore'

export async function GET() {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const db = getDb()

    const approvedSubs = db.collection('duroodSubmissions').where('status', '==', 'APPROVED')

    const [
      approvedSnap,
      booksCount,
      naatCount,
      bayanCount,
      audioCount,
      videoCount,
      galleryCount,
      blogCount,
      newsCount,
      faqCount,
    ] = await Promise.all([
      approvedSubs.select('duroodCount', 'isAnonymous', 'userName', 'createdAt').get(),
      db.collection('bookResources').count().get(),
      db.collection('naats').count().get(),
      db.collection('bayans').count().get(),
      db.collection('audioResources').count().get(),
      db.collection('videoResources').count().get(),
      db.collection('galleryImages').count().get(),
      db.collection('blogPosts').where('isPublished', '==', true).count().get(),
      db.collection('news').where('isPublished', '==', true).count().get(),
      db.collection('faqs').where('isActive', '==', true).count().get(),
    ])

    let totalDurood = 0
    const totalSubmissions = approvedSnap.size
    const contributors = new Set<string>()
    const contributorsThisWeek = new Set<string>()

    for (const doc of approvedSnap.docs) {
      const d = doc.data()
      totalDurood += d.duroodCount || 0
      if (!d.isAnonymous) {
        contributors.add(d.userName)
        if (d.createdAt.toDate() >= sevenDaysAgo) contributorsThisWeek.add(d.userName)
      }
    }

    const totalResources =
      booksCount.data().count +
      naatCount.data().count +
      bayanCount.data().count +
      audioCount.data().count +
      videoCount.data().count +
      galleryCount.data().count +
      blogCount.data().count +
      newsCount.data().count +
      faqCount.data().count

    return NextResponse.json({
      totalDurood,
      totalSubmissions,
      totalResources,
      totalContributors: contributors.size,
      contributorsThisWeek: contributorsThisWeek.size,
    })
  } catch (error) {
    console.error('Dashboard summary error:', error)
    return NextResponse.json({ error: 'Something went wrong loading the dashboard.' }, { status: 500 })
  }
}
