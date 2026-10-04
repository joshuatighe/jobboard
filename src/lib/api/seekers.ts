import { supabase } from '@/lib/supabase'
import { looksLikePdf, resumeFileError, resumeObjectPath } from '@/lib/resume'
import type { TablesInsert, TablesUpdate } from '@/types/database'

export async function fetchSeekerProfile(userId: string) {
  const { data, error } = await supabase
    .from('seeker_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw error
  return data
}

export type SeekerProfileUpdate = Omit<
  TablesUpdate<'seeker_profiles'>,
  'user_id' | 'resume_path' | 'resume_filename' | 'updated_at'
>

/** R2: headline, bio, skills and preferences. RLS only lets seekers update their own row. */
export async function updateSeekerProfile(userId: string, patch: SeekerProfileUpdate) {
  const { data, error } = await supabase
    .from('seeker_profiles')
    .update(patch)
    .eq('user_id', userId)
    .select()
    .single()
  if (error) throw error
  return data
}

/** A short-lived link to a private resume (R3). RLS decides who can sign it. */
export async function resumeUrl(path: string) {
  const { data, error } = await supabase.storage.from('resumes').createSignedUrl(path, 60 * 5)
  if (error) throw error
  return data.signedUrl
}

/**
 * R3: upload a new resume and make it the one on file.
 *
 * Each upload gets its own path rather than overwriting the old file, because applications
 * snapshot `resume_path` when they're sent. The previous file is deleted only when no application
 * points at it.
 */
export async function uploadResume(userId: string, file: File) {
  const invalid = resumeFileError(file)
  if (invalid) throw new Error(invalid)
  if (!(await looksLikePdf(file))) throw new Error("That file isn't a valid PDF.")

  const previous = await fetchSeekerProfile(userId)
  const path = resumeObjectPath(userId, file.name)

  const { error: uploadError } = await supabase.storage
    .from('resumes')
    .upload(path, file, { contentType: 'application/pdf', upsert: false })
  if (uploadError) throw new Error(uploadError.message)

  const { data, error } = await supabase
    .from('seeker_profiles')
    .update({ resume_path: path, resume_filename: file.name })
    .eq('user_id', userId)
    .select()
    .single()
  if (error) {
    await supabase.storage.from('resumes').remove([path])
    throw error
  }

  const oldPath = previous?.resume_path
  if (oldPath && oldPath !== path) await removeResumeIfUnused(userId, oldPath)

  return data
}

/** Best effort: a leftover file only costs storage, so failures here are not surfaced. */
async function removeResumeIfUnused(userId: string, path: string) {
  const { count, error } = await supabase
    .from('applications')
    .select('id', { count: 'exact', head: true })
    .eq('seeker_id', userId)
    .eq('resume_path', path)
  if (error || count !== 0) return
  const { error: removeError } = await supabase.storage.from('resumes').remove([path])
  if (removeError) console.warn('Could not remove the previous resume', removeError)
}

// ---------------------------------------------------------------------------
// Experience (R2)
// ---------------------------------------------------------------------------

export async function fetchExperiences(userId: string) {
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .eq('user_id', userId)
    .order('start_date', { ascending: false })
  if (error) throw error
  return data
}

export type ExperienceInput = Omit<TablesInsert<'experiences'>, 'id' | 'user_id' | 'created_at'>

/** Creates the entry, or updates it when `id` is given. */
export async function saveExperience(userId: string, input: ExperienceInput, id?: string) {
  const query = id
    ? supabase.from('experiences').update(input).eq('id', id).eq('user_id', userId)
    : supabase.from('experiences').insert({ ...input, user_id: userId })
  const { data, error } = await query.select().single()
  if (error) throw error
  return data
}

export async function deleteExperience(id: string) {
  const { error } = await supabase.from('experiences').delete().eq('id', id)
  if (error) throw error
}
