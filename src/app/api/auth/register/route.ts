import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getDb } from '@/lib/db/firestore'
import { signAdminToken, USER_COOKIE_NAME } from '@/lib/auth/jwt'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, confirmPassword } = await request.json()

    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json({ error: 'Please fill in all fields.' }, { status: 400 })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 })
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: 'Passwords do not match.' }, { status: 400 })
    }

    const db = getDb()
    const users = db.collection('users')
    const normalizedEmail = String(email).trim().toLowerCase()

    const existing = await users.where('email', '==', normalizedEmail).limit(1).get()
    if (!existing.empty) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const now = new Date()

    const ref = await users.add({
      name: String(name).trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: 'USER',
      isActive: true,
      totalSubmissions: 0,
      createdAt: now,
      updatedAt: now,
    })

    const token = await signAdminToken({
      userId: ref.id,
      email: normalizedEmail,
      name: String(name).trim(),
      role: 'USER',
    })

    const response = NextResponse.json({
      user: { id: ref.id, name: String(name).trim(), email: normalizedEmail, role: 'USER' },
    })

    response.cookies.set(USER_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
