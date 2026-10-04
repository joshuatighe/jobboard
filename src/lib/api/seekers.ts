import { supabase } from '@/lib/supabase'

export async function fetchSeekerProfile(userId: string) {
  const { data, error } = await supabase
    .from('seeker_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw error
  return data
}

/** A short-lived link to a private resume (R3). RLS decides who can sign it. */
export async function resumeUrl(path: string) {
  const { data, error } = await supabase.storage.from('resumes').createSignedUrl(path, 60 * 5)
  if (error) throw error
  return data.signedUrl
}
