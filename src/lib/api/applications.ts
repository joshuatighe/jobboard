import { supabase } from '@/lib/supabase'

/** The seeker's application to a job, if they have one. RLS only returns their own. */
export async function fetchMyApplication(jobId: string, seekerId: string) {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('job_id', jobId)
    .eq('seeker_id', seekerId)
    .maybeSingle()
  if (error) throw error
  return data
}

export type ApplyInput = { jobId: string; seekerId: string; coverNote?: string }

/**
 * R7: apply to an open job. The database snapshots the resume on file and rejects duplicates,
 * non-seekers and jobs that aren't open.
 */
export async function applyToJob({ jobId, seekerId, coverNote }: ApplyInput) {
  const { data, error } = await supabase
    .from('applications')
    .insert({ job_id: jobId, seeker_id: seekerId, cover_note: coverNote?.trim() || null })
    .select()
    .single()
  if (error) {
    if (error.code === '23505') throw new Error("You've already applied to this job.")
    throw new Error(error.message)
  }
  return data
}
