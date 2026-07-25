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

    const db = getDb()
    const snap = await db
      .collection('donations')
      .where('userId', '==', payload.userId)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get()

    let totalAmount = 0
    const donations = snap.docs.map((doc) => {
      const d = doc.data()
      totalAmount += d.amount || 0
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
