import type { UserRole } from '@/lib/types'

/** Where each role lands after signing in. */
export function homeFor(role: UserRole | undefined) {
  return role === 'recruiter' ? '/dashboard' : '/for-you'
}
