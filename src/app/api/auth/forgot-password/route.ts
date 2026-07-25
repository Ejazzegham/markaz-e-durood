import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db/firestore'
import { generateResetToken } from '@/lib/auth/resetToken'
import { sendPasswordResetEmail } from '@/lib/auth/mailer'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Please enter your email address.' }, { status: 400 })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const db = getDb()
    const users = db.collection('users')

    const snap = await users.where('email', '==', normalizedEmail).limit(1).get()
    const doc = snap.docs[0]

    // Always return the same success message whether or not the account
    // exists, so this endpoint can't be used to check which emails are
    // registered.
    const genericSuccess = NextResponse.json({
      message: 'If an account exists for that email, a reset link has been sent.',
    })

    if (!doc) return genericSuccess

    const user = doc.data() as any
    const { rawToken, tokenHash, expiresAt } = generateResetToken()

    await doc.ref.update({
      resetPasswordTokenHash: tokenHash,
      resetPasswordExpires: expiresAt,
      updatedAt: new Date(),
    })

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `${request.nextUrl.origin}`
    const resetUrl = `${siteUrl}/account/reset-password?token=${rawToken}&email=${encodeURIComponent(normalizedEmail)}`

    await sendPasswordResetEmail(normalizedEmail, user.name, resetUrl)

    return genericSuccess
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
