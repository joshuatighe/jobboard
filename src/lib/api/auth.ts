import { supabase } from '@/lib/supabase'
import type { Profile, UserRole } from '@/lib/types'

export type SignUpInput = {
  email: string
  password: string
  fullName: string
  role: UserRole
  /** Required for recruiters. Creates the company if it doesn't exist yet. */
  companyName?: string
}

export async function signUp({ email, password, fullName, role, companyName }: SignUpInput) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Read by the `handle_new_user` trigger to create profile rows.
      data: { full_name: fullName, role, company_name: companyName },
    },
  })
  if (error) throw error
  return data
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle()
  if (error) throw error
  return data
}
