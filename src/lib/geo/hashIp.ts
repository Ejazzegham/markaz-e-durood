import { createHash } from 'crypto'

// We never store a visitor's raw IP address — only a one-way hash of it,
// used purely as a stable document key so repeat visits from the same
// address increment an existing record instead of creating a new one.
export function hashIp(ip: string): string {
  return createHash('sha256').update(ip.trim().toLowerCase()).digest('hex').slice(0, 32)
}
