import { UUID } from '@/lib/api/jobs'
import type { PostingFields } from '@/lib/postings'
import { supabase } from '@/lib/supabase'
import type { JobStatus } from '@/lib/types'

/** R9: the signed-in recruiter's company. Null if the membership row is missing. */
export async function fetchMyCompany(userId: string) {
  const { data, error } = await supabase
    .from('recruiters')
    .select('company:companies (id, name)')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw error
  return data?.company ?? null
}

const POSTING = '*, applications (status)' as const

/**
 * R11: every posting at the company (drafts, open and closed), with each applicant's status so
 * the dashboard can count them. Filtered by company because RLS also returns other companies'
 * open jobs, which are public.
 */
export async function fetchCompanyPostings(companyId: string) {
  const { data, error } = await supabase
    .from('jobs')
    .select(POSTING)
    .eq('company_id', companyId)
    .order('updated_at', { ascending: false })
  if (error) throw error
  return data
}

export type Posting = Awaited<ReturnType<typeof fetchCompanyPostings>>[number]

/** One of the company's postings. Null when it doesn't exist or belongs to another company. */
export async function fetchPosting(companyId: string, jobId: string) {
  if (!UUID.test(jobId)) return null
  const { data, error } = await supabase
    .from('jobs')
    .select(POSTING)
    .eq('id', jobId)
    .eq('company_id', companyId)
    .maybeSingle()
  if (error) throw error
  return data
}

/**
 * R10: create a posting. The database fills in the company and recruiter from the session, and
 * column grants stop clients from setting them (or timestamps) themselves.
 */
export async function createPosting(fields: PostingFields, status: Extract<JobStatus, 'draft' | 'open'>) {
  const { data, error } = await supabase
    .from('jobs')
    .insert({ ...fields, status })
    .select(POSTING)
    .single()
  if (error) throw new Error(error.message)
  return data
}

/** R10/R11: save edits, and optionally change the status in the same write. */
export async function updatePosting(jobId: string, fields: Partial<PostingFields> & { status?: JobStatus }) {
  const { data, error } = await supabase
    .from('jobs')
    .update(fields)
    .eq('id', jobId)
    .select(POSTING)
    .single()
  if (error) throw new Error(error.message)
  return data
}

/** Drafts only (RLS). Published postings are closed instead, so applicants keep their history. */
export async function deletePosting(jobId: string) {
  const { data, error } = await supabase.from('jobs').delete().eq('id', jobId).select('id')
  if (error) throw new Error(error.message)
  if (data.length === 0) throw new Error('Only drafts can be deleted. Close the posting instead.')
}
