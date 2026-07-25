import { SignJWT, jwtVerify } from 'jose'

// Runs in both the Node.js API routes and the Edge middleware, so we use
// `jose` here rather than the `jsonwebtoken` package (which needs Node APIs
// that aren't available in the Edge runtime that middleware.ts runs on).

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'markaz-e-durood-dev-secret-change-me'
)

export interface AdminTokenPayload {
  userId: string
  email: string
  name: string
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN'
}

export async function signAdminToken(payload: AdminTokenPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)
}

export async function verifyAdminToken(token: string): Promise<AdminTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as unknown as AdminTokenPayload
  } catch {
    return null
  }
}

export const ADMIN_COOKIE_NAME = 'med_admin_token'

// Separate cookie for regular site visitors (role USER) so a public login
// never overlaps with an admin session in the same browser.
export const USER_COOKIE_NAME = 'med_user_token'
