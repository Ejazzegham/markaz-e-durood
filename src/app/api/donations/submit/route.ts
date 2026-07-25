import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Timestamp } from 'firebase-admin/firestore'
import { getDb } from '@/lib/db/firestore'
import { USER_COOKIE_NAME, verifyAdminToken } from '@/lib/auth/jwt'

// There's no payment gateway wired up (no Stripe/PayPal keys in .env), so
// this records a donation pledge — the same thing the site's original
// "Your donation request has been received" placeholder implied. The
// record is what powers the member dashboard's donation history; actually
// collecting the money still happens outside this flow (bank transfer,
// in person, a follow-up call, etc).
const donateSchema = z.object({
  donorName: z.string().trim().min(1).max(80).optional(),
  email: z.string().trim().email().max(120).optional().or(z.literal('')),
  amount: z.number().positive().max(100000000),
  currency: z.string().trim().max(10).optional(),
  message: z.string().trim().max(500).optional(),
  isAnonymous: z.boolean().optional(),
})

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) return forwardedFor.split(',')[0].trim()
  return request.headers.get('x-real-ip') || 'unknown'
}

export async function POST(request: NextRequest) {
  try {
    // Donating works for both guests and signed-in members, same as the
    // Durood counter. A logged-in visitor's donation is linked to their
    // account (so it shows up in their dashboard history); a guest's is
    // still recorded under whatever name they typed, or "Anonymous".
    const userToken = request.cookies.get(USER_COOKIE_NAME)?.value
    const userPayload = userToken ? await verifyAdminToken(userToken) : null

    const body = await request.json()
    const parsed = donateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Please enter a valid donation amount and try again.' },
        { status: 400 }
      )
    }

    if (!userPayload && !parsed.data.isAnonymous && !parsed.data.donorName) {
      return NextResponse.json(
        { error: 'Please enter your name, or choose to donate anonymously.' },
        { status: 400 }
      )
    }

    const ipAddress = getClientIp(request)
    const db = getDb()
    const donations = db.collection('donations')

    // Same lightweight abuse guard as the Durood counter: block rapid-fire
    // repeat submissions from the same IP.
    const threeSecondsAgo = Timestamp.fromDate(new Date(Date.now() - 3000))
    const recentSnap = await donations
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

    const isAnonymous = parsed.data.isAnonymous ?? !parsed.data.donorName
    const donorName = isAnonymous
      ? 'Anonymous'
      : (parsed.data.donorName as string) || userPayload?.name || 'Anonymous'

    const now = new Date()
    const data = {
      userId: userPayload?.userId ?? null,
      donorName,
      email: parsed.data.email || userPayload?.email || null,
      amount: parsed.data.amount,
      currency: (parsed.data.currency || 'PKR').toUpperCase(),
      message: parsed.data.message || null,
      isAnonymous,
      ipAddress,
      status: 'RECEIVED', // recorded — not yet collected/reconciled by an admin
      createdAt: now,
      updatedAt: now,
    }
    const ref = await donations.add(data)

    return NextResponse.json({ donation: { id: ref.id, ...data } }, { status: 201 })
  } catch (error) {
    console.error('Donation submission error:', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
