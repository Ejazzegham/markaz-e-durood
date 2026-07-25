import { NextRequest, NextResponse } from 'next/server'
import { USER_COOKIE_NAME, verifyAdminToken } from '@/lib/auth/jwt'

export async function GET(request: NextRequest) {
  const token = request.cookies.get(USER_COOKIE_NAME)?.value
  const payload = token ? await verifyAdminToken(token) : null

  if (!payload) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  return NextResponse.json({
    user: { name: payload.name, email: payload.email, role: payload.role },
  })
}
