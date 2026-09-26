import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db/firestore'
import { USER_COOKIE_NAME, verifyAdminToken } from '@/lib/auth/jwt'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(USER_COOKIE_NAME)?.value
    const payload = token ? await verifyAdminToken(token) : null

    if (!payload) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // NOTE: intentionally no `.orderBy('createdAt', 'desc')` here. Combining
    // a `.where('userId', '==', ...)` filter with an orderBy on a different
    // field requires a Firestore composite index, and none was ever created
    // for the 'donations' collection — that was throwing a
    // FAILED_PRECONDITION error on every load of this page. Sorting is done
    // in code below instead, which needs no index at all. 200 is comfortably
    // above what any one donor is expected to submit; raise it if that
    // stops being true.
    const db = getDb()
    const snap = await db
      .collection('donations')
      .where('userId', '==', payload.userId)
      .limit(200)
      .get()

    const allDonations = snap.docs.map((doc) => {
      const d = doc.data()
      return {
        id: doc.id,
        amount: d.amount,
        currency: d.currency || 'PKR',
        message: d.message || null,
        isAnonymous: Boolean(d.isAnonymous),
        status: d.status,
        createdAt: d.createdAt?.toDate ? d.createdAt.toDate() : d.createdAt,
      }
    })

    allDonations.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    const donations = allDonations.slice(0, 50)
    const totalAmount = donations.reduce((sum, d) => sum + (d.amount || 0), 0)

    return NextResponse.json({
      donations,
      totalDonations: donations.length,
      totalAmount,
    })
  } catch (error) {
    console.error('My donations error:', error)
    return NextResponse.json({ error: 'Something went wrong loading your history.' }, { status: 500 })
  }
}
