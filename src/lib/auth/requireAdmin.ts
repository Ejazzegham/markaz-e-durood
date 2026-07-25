import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE_NAME, verifyAdminToken, AdminTokenPayload } from './jwt'

/**
 * Verifies the admin cookie on an API request.
 * Returns the decoded token payload if valid, or a 401 NextResponse to
 * return immediately if not. Middleware already blocks unauthenticated
 * requests to /api/admin/*, but routes check again themselves so they stay
 * safe even if called directly or if the middleware matcher ever changes.
 */
export async function requireAdmin(
  request: NextRequest
): Promise<AdminTokenPayload | NextResponse> {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value

  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const payload = await verifyAdminToken(token)

  if (!payload || (payload.role !== 'ADMIN' && payload.role !== 'SUPER_ADMIN')) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
  }

  return payload
}
