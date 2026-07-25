import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Timestamp } from 'firebase-admin/firestore'
import { getDb } from '@/lib/db/firestore'

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
    const userName = isAnonymous ? 'Anonymous' : (parsed.data.userName as string)

    const now = new Date()
    const data = {
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
