import crypto from 'crypto'

// Password-reset tokens follow the standard "store only a hash" pattern:
// the raw token is emailed to the user and never saved anywhere, while a
// SHA-256 hash of it (plus an expiry) is stored on the user's Firestore doc.
// That way a leaked/compromised database still can't be used to reset
// anyone's password, since the raw token can't be recovered from its hash.

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000 // 1 hour

export function generateResetToken(): { rawToken: string; tokenHash: string; expiresAt: Date } {
  const rawToken = crypto.randomBytes(32).toString('hex')
  const tokenHash = hashResetToken(rawToken)
  const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS)
  return { rawToken, tokenHash, expiresAt }
}

export function hashResetToken(rawToken: string): string {
  return crypto.createHash('sha256').update(rawToken).digest('hex')
}
