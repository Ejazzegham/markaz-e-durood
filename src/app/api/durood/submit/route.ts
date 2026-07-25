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
    // Submitting Durood works for both guests and signed-in members. If a
    // valid session cookie is present we attach the submission to that
    // account (so it shows up in the member's dashboard history); if not,
    // we still accept the submission under whatever name the visitor typed
    // (or "Anonymous") so no one is forced to register first.
    const userToken = request.cookies.get(USER_COOKIE_NAME)?.value
    const userPayload = userToken ? await verifyAdminToken(userToken) : null

    const body = await request.json()
    const parsed = submitSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Please enter a valid count (1–100,000) and try again.' },
        { status: 400 }
      )
    }

    // Guests must give a name unless they're submitting anonymously — a
    // signed-in member can leave it blank and we'll fall back to their
    // account name instead.
    if (!userPayload && !parsed.data.isAnonymous && !parsed.data.userName) {
      return NextResponse.json(
        { error: 'Please enter your name, or choose to submit anonymously.' },
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
    // but for signed-in members we still tag every submission with their
    // real userId below so they can see their own full history in their
    // dashboard even when the public-facing name is "Anonymous".
    const userName = isAnonymous
      ? 'Anonymous'
      : (parsed.data.userName as string) || userPayload?.name || 'Anonymous'

    const now = new Date()
    const data = {
      userId: userPayload?.userId ?? null,
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
