import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getDb } from '@/lib/db/firestore'
import { signAdminToken, USER_COOKIE_NAME } from '@/lib/auth/jwt'

export async function POST(request: NextRequest) {
  try {
    const { email, password, remember } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
    }

    const normalizedEmail = String(email).trim().toLowerCase()
    const db = getDb()

    const snap = await db.collection('users').where('email', '==', normalizedEmail).limit(1).get()
    const doc = snap.docs[0]
    const user = doc ? ({ id: doc.id, ...doc.data() } as any) : null

    if (!user || !user.isActive) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
    }

    const passwordMatches = await bcrypt.compare(password, user.password)
    if (!passwordMatches) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
    }

    // "Remember me" extends both the signed token's own expiry and the
    // cookie's maxAge to 30 days. Unchecked, the token/cookie last a normal
    // 1-day session so the browser doesn't keep the user signed in
    // indefinitely once the tab/browser is closed.
    const rememberMe = Boolean(remember)
    const tokenExpiry = rememberMe ? '30d' : '1d'
    const cookieMaxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24

    const token = await signAdminToken(
      {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      tokenExpiry
    )

    const response = NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    })

    response.cookies.set(USER_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: cookieMaxAge,
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
