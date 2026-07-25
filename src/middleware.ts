import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE_NAME, USER_COOKIE_NAME, verifyAdminToken } from '@/lib/auth/jwt'

// Routes that require a signed-in site member (not just an admin). Anyone
// without a valid med_user_token cookie gets bounced to /account/login.
// Note: /account/donate and /account/submit-durood are intentionally NOT
// listed here — both support guest (unregistered) submissions, so they must
// stay publicly reachable. Only /dashboard (which shows a member's personal
// history) requires a real account.
const USER_PROTECTED_PATHS = ['/dashboard']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // --- Admin area ---
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      return NextResponse.next()
    }

    const adminToken = request.cookies.get(ADMIN_COOKIE_NAME)?.value
    const adminPayload = adminToken ? await verifyAdminToken(adminToken) : null
    const isAdminAuthorized =
      adminPayload && (adminPayload.role === 'ADMIN' || adminPayload.role === 'SUPER_ADMIN')

    if (!isAdminAuthorized) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
  }

  // --- Member-only pages (dashboard) ---
  if (USER_PROTECTED_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    const userToken = request.cookies.get(USER_COOKIE_NAME)?.value
    const userPayload = userToken ? await verifyAdminToken(userToken) : null

    if (!userPayload) {
      const loginUrl = new URL('/account/login', request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
}
