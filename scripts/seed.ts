/**
 * Seeds demo data into the Supabase project: companies, jobs, demo users (with profiles,
 * experiences and PDF resumes) and applications with realistic status timelines.
 *
 * Idempotent: safe to re-run. Rows use stable IDs or natural keys and existing
 * applications are left alone.
 *
 * Usage: pnpm db:seed   (needs VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY)
 */
import { createHash } from 'node:crypto'

import { createClient, type User } from '@supabase/supabase-js'

import type { Database } from '../src/types/database.ts'
import { COMPANIES } from './seed/companies.ts'
import { describeJob, JOBS } from './seed/jobs.ts'
import {
  APPLICANTS,
  APPLICATIONS,
  DEMO_PASSWORD,
  DEMO_RECRUITER,
  DEMO_SEEKER,
  type SeedSeeker,
} from './seed/people.ts'
import { resumePdf } from './seed/resume-pdf.ts'

const url = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !serviceKey) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. See .env.example.')
  process.exit(1)
}

const db = createClient<Database>(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const DAY = 24 * 60 * 60 * 1000
const daysAgo = (days: number) => new Date(Date.now() - days * DAY)

/** Deterministic UUID from a string key, so re-runs upsert the same rows. */
function stableId(key: string): string {
  const h = createHash('sha1').update(`jobboard:${key}`).digest('hex')
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-5${h.slice(13, 16)}-a${h.slice(17, 20)}-${h.slice(20, 32)}`
}

function check<T>(result: { data: T; error: unknown }, what: string): T {
  if (result.error) {
    console.error(`✗ ${what}`, result.error)
    process.exit(1)
  }
  return result.data
}

/** Like `check`, but also fails when no data came back. */
function required<T>(result: { data: T; error: unknown }, what: string): NonNullable<T> {
  const data = check(result, what)
  if (data == null) {
    console.error(`✗ ${what}: no data returned`)
    process.exit(1)
  }
  return data
}

async function existingUsers(): Promise<Map<string, User>> {
  const users = new Map<string, User>()
  for (let page = 1; ; page++) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage: 1000 })
    if (error) throw error
    data.users.forEach((u) => u.email && users.set(u.email, u))
    if (data.users.length < 1000) return users
  }
}

async function ensureUser(
  users: Map<string, User>,
  email: string,
  metadata: Record<string, string>,
): Promise<string> {
  const existing = users.get(email)
  if (existing) return existing.id
  const { data, error } = await db.auth.admin.createUser({
    email,
    password: DEMO_PASSWORD,
    email_confirm: true,
    user_metadata: metadata, // read by the handle_new_user trigger
  })
  if (error) throw error
  return data.user.id
}

async function seedSeeker(userId: string, seeker: SeedSeeker) {
  const path = `${userId}/resume.pdf`
  const upload = await db.storage.from('resumes').upload(path, resumePdf(seeker), {
    contentType: 'application/pdf',
    upsert: true,
  })
  check(upload, `upload resume for ${seeker.email}`)

  check(
    await db
      .from('seeker_profiles')
      .update({
        headline: seeker.headline,
        location: seeker.location,
        bio: seeker.bio,
        skills: seeker.skills,
        resume_path: path,
        resume_filename: `${seeker.fullName.replace(/\s+/g, '_')}_Resume.pdf`,
        pref_locations: seeker.prefs.locations,
        pref_remote: seeker.prefs.remote,
        pref_min_pay: seeker.prefs.minPay,
        pref_experience_level: seeker.prefs.level,
        pref_employment_types: seeker.prefs.types,
      })
      .eq('user_id', userId),
    `seeker profile for ${seeker.email}`,
  )

  check(await db.from('experiences').delete().eq('user_id', userId), 'clear experiences')
  check(
    await db.from('experiences').insert(
      seeker.experiences.map((e) => ({
        user_id: userId,
        title: e.title,
        company: e.company,
        location: e.location ?? null,
        start_date: e.start,
        end_date: e.end ?? null,
        description: e.description,
      })),
    ),
    `experiences for ${seeker.email}`,
  )
}

async function main() {
  console.log(`Seeding ${url}`)

  // Companies
  const companies = required(
    await db
      .from('companies')
      .upsert(
        COMPANIES.map((c) => ({ id: stableId(`company:${c.slug}`), ...c })),
        { onConflict: 'slug' },
      )
      .select('id, slug, name'),
    'companies',
  )
  const companyBySlug = new Map(companies.map((c) => [c.slug, c]))
  console.log(`✓ ${companies.length} companies`)

  // Users
  const users = await existingUsers()
  const recruiterCompany = companyBySlug.get(DEMO_RECRUITER.company)!
  const recruiterId = await ensureUser(users, DEMO_RECRUITER.email, {
    role: 'recruiter',
    full_name: DEMO_RECRUITER.fullName,
    company_name: recruiterCompany.name,
  })
  check(
    await db.from('recruiters').update({ title: DEMO_RECRUITER.title }).eq('user_id', recruiterId),
    'recruiter title',
  )

  const seekerIds = new Map<string, string>()
  for (const seeker of [DEMO_SEEKER, ...APPLICANTS]) {
    const id = await ensureUser(users, seeker.email, { role: 'seeker', full_name: seeker.fullName })
    seekerIds.set(seeker.email, id)
    await seedSeeker(id, seeker)
  }
  console.log(`✓ 1 recruiter, ${seekerIds.size} seekers (with resumes and experience)`)

  // Jobs. Insert as open first so seeded applications to now-closed roles are accepted.
  const jobRows = JOBS.map((job) => {
    const company = companyBySlug.get(job.company)!
    const created = daysAgo(job.daysAgo).toISOString()
    return {
      id: stableId(`job:${job.key}`),
      company_id: company.id,
      recruiter_id: job.company === DEMO_RECRUITER.company ? recruiterId : null,
      title: job.title,
      description: describeJob(job, company.name),
      location: job.location,
      is_remote: job.remote ?? false,
      pay_min: job.pay[0],
      pay_max: job.pay[1],
      pay_period: job.period ?? 'year',
      experience_level: job.level,
      employment_type: job.type ?? 'full_time',
      skills: job.skills,
      status: 'open' as const,
      created_at: created,
      updated_at: created,
    }
  })
  check(await db.from('jobs').upsert(jobRows, { onConflict: 'id' }), 'jobs')
  console.log(`✓ ${jobRows.length} jobs`)

  // Applications with backdated timelines
  let created = 0
  for (const app of APPLICATIONS) {
    const jobId = stableId(`job:${app.job}`)
    const seekerId = seekerIds.get(app.seeker)!
    const existing = check(
      await db
        .from('applications')
        .select('id')
        .eq('job_id', jobId)
        .eq('seeker_id', seekerId)
        .maybeSingle(),
      'lookup application',
    )
    if (existing) continue

    const start = daysAgo(app.daysAgo)
    const statuses = ['applied' as const, ...app.path]
    const step = (Date.now() - start.getTime()) / (statuses.length + 0.5)
    const times = statuses.map((_, i) => new Date(start.getTime() + i * step).toISOString())

    const inserted = required(
      await db
        .from('applications')
        .insert({
          job_id: jobId,
          seeker_id: seekerId,
          status: statuses.at(-1)!,
          cover_note: app.coverNote ?? null,
          created_at: times[0],
          updated_at: times.at(-1),
        })
        .select('id')
        .single(),
      `application ${app.seeker} → ${app.job}`,
    )

    // Replace the trigger's single event with the full, backdated history.
    const isDemoCompany = JOBS.find((j) => j.key === app.job)?.company === DEMO_RECRUITER.company
    check(
      await db.from('application_events').delete().eq('application_id', inserted.id),
      'clear events',
    )
    check(
      await db.from('application_events').insert(
        statuses.map((status, i) => ({
          application_id: inserted.id,
          from_status: i === 0 ? null : statuses[i - 1],
          to_status: status,
          changed_by: i === 0 ? seekerId : isDemoCompany ? recruiterId : null,
          created_at: times[i],
        })),
      ),
      'application events',
    )
    created++
  }
  console.log(`✓ ${created} new applications (${APPLICATIONS.length - created} already existed)`)

  // Final job statuses (drafts and closed roles)
  for (const job of JOBS.filter((j) => j.status && j.status !== 'open')) {
    check(
      await db.from('jobs').update({ status: job.status }).eq('id', stableId(`job:${job.key}`)),
      `status for ${job.key}`,
    )
  }

  console.log('\nDone. Demo accounts (password: %s):', DEMO_PASSWORD)
  console.log(`  Job seeker: ${DEMO_SEEKER.email}`)
  console.log(`  Recruiter:  ${DEMO_RECRUITER.email}`)
}

main().catch((error: unknown) => {
  console.error(error)
  process.exit(1)
})
