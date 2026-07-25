import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getDb } from '@/lib/db/firestore'
import { hashResetToken } from '@/lib/auth/resetToken'

export async function POST(request: NextRequest) {
  try {
    const { email, token, password, confirmPassword } = await request.json()

    if (!email || !token || !password || !confirmPassword) {
      return NextResponse.json({ error: 'Please fill in all fields.' }, { status: 400 })
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: 'Passwords do not match.' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 })
    }

    const normalizedEmail = String(email).trim().toLowerCase()
    const db = getDb()
    const users = db.collection('users')

    const snap = await users.where('email', '==', normalizedEmail).limit(1).get()
    const doc = snap.docs[0]

    if (!doc) {
      return NextResponse.json({ error: 'This reset link is invalid or has expired.' }, { status: 400 })
    }

    const user = doc.data() as any
    const tokenHash = hashResetToken(token)

    const isValidToken =
      user.resetPasswordTokenHash &&
      user.resetPasswordTokenHash === tokenHash &&
      user.resetPasswordExpires &&
      user.resetPasswordExpires.toDate().getTime() > Date.now()

    if (!isValidToken) {
      return NextResponse.json({ error: 'This reset link is invalid or has expired.' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await doc.ref.update({
      password: hashedPassword,
      resetPasswordTokenHash: null,
      resetPasswordExpires: null,
      updatedAt: new Date(),
    })

    return NextResponse.json({ message: 'Your password has been reset. You can now log in.' })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
