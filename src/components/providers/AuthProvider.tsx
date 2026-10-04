import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'

import { fetchProfile } from '@/lib/api/auth'
import { AuthContext, type AuthState } from '@/lib/auth-context'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'
import type { Profile } from '@/lib/types'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [sessionReady, setSessionReady] = useState(!isSupabaseConfigured)
  // Which user the current `profile` value belongs to, so we know when it's stale.
  const [profileState, setProfileState] = useState<{ userId: string; profile: Profile | null }>()

  useEffect(() => {
    if (!isSupabaseConfigured) return

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setSessionReady(true)
    })

    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next)
      setSessionReady(true)
    })
    return () => data.subscription.unsubscribe()
  }, [])

  const userId = session?.user.id

  const loadProfile = useCallback(async (id: string) => {
    let profile: Profile | null = null
    try {
      profile = await fetchProfile(id)
    } catch (error) {
      console.error('Failed to load profile', error)
    }
    setProfileState({ userId: id, profile })
  }, [])

  useEffect(() => {
    if (!userId) return
    let cancelled = false
    fetchProfile(userId)
      .catch((error: unknown) => {
        console.error('Failed to load profile', error)
        return null
      })
      .then((profile) => {
        if (!cancelled) setProfileState({ userId, profile })
      })
    return () => {
      cancelled = true
    }
  }, [userId])

  const refreshProfile = useCallback(async () => {
    if (userId) await loadProfile(userId)
  }, [userId, loadProfile])

  const value = useMemo<AuthState>(() => {
    const profileLoaded = !userId || profileState?.userId === userId
    return {
      status: !sessionReady || !profileLoaded ? 'loading' : session ? 'signed-in' : 'signed-out',
      session,
      user: session?.user ?? null,
      profile: userId && profileState?.userId === userId ? profileState.profile : null,
      refreshProfile,
    }
  }, [sessionReady, session, userId, profileState, refreshProfile])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
