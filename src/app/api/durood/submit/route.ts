import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Timestamp } from 'firebase-admin/firestore'
import { getDb } from '@/lib/db/firestore'
import { USER_COOKIE_NAME, verifyAdminToken } from '@/lib/auth/jwt'

const submitSchema = z.object({
  userName: z.string().trim().min(1).max(60).optional(),
  duroodCount: z.number().int().min(1).max(100000),
  duroodType: z.string().trim().max(60).optional(),
  isAnonymous: z.boolean().optional(),
})

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) return forwardedFor.split(',')[0].trim()
  return request.headers.get('x-real-ip') || 'unknown'
}

export async function POST(request: NextRequest) {
  try {
    // Submitting Durood is now a member-only action — the page itself is
    // gated by middleware, but we check again here so the API can't be
    // called directly by a signed-out visitor.
    const userToken = request.cookies.get(USER_COOKIE_NAME)?.value
    const userPayload = userToken ? await verifyAdminToken(userToken) : null

    if (!userPayload) {
      return NextResponse.json(
        { error: 'Please log in to submit Durood.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const parsed = submitSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Please enter a valid count (1–100,000) and try again.' },
        { status: 400 }
      )
    }

    const ipAddress = getClientIp(request)
    const db = getDb()
    const submissions = db.collection('duroodSubmissions')

    // Lightweight abuse guard: block rapid-fire repeat submissions from the
    // same IP rather than requiring a full account/login system.
    const threeSecondsAgo = Timestamp.fromDate(new Date(Date.now() - 3000))
    const recentSnap = await submissions
      .where('ipAddress', '==', ipAddress)
      .where('createdAt', '>=', threeSecondsAgo)
      .limit(1)
      .get()
    if (!recentSnap.empty) {
      return NextResponse.json(
        { error: 'Please wait a moment before submitting again.' },
        { status: 429 }
      )
    }

    const isAnonymous = parsed.data.isAnonymous ?? !parsed.data.userName
    // The display name respects "submit anonymously" for public listings,
    // but we still tag every submission with the real userId below so the
    // signed-in user can see their own full history in their dashboard.
    const userName = isAnonymous ? 'Anonymous' : (parsed.data.userName as string) || userPayload.name

    const now = new Date()
    const data = {
      userId: userPayload.userId,
      userName,
      duroodCount: parsed.data.duroodCount,
      duroodType: parsed.data.duroodType || 'General',
      isAnonymous,
      ipAddress,
      status: 'APPROVED', // auto-approved so the counter updates immediately
      createdAt: now,
      updatedAt: now,
    }
    const ref = await submissions.add(data)

    return NextResponse.json({ submission: { id: ref.id, ...data } }, { status: 201 })
  } catch (error) {
    console.error('Durood submission error:', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
