import { createContext } from 'react'
import type { Session, User } from '@supabase/supabase-js'

import type { Profile } from '@/lib/types'

export type AuthState = {
  status: 'loading' | 'signed-out' | 'signed-in'
  session: Session | null
  user: User | null
  /** Null while loading, when signed out, or if the profile row could not be loaded. */
  profile: Profile | null
  refreshProfile: () => Promise<void>
}

export const AuthContext = createContext<AuthState | null>(null)
