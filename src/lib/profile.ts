import type { Experience, SeekerProfile } from '@/lib/types'

/** `2024-03-01` → `2024-03`, the value the month pickers work with. */
export function toMonthValue(date: string | null | undefined): string {
  return date ? date.slice(0, 7) : ''
}

/** `2024-03` → `2024-03-01`. Experience dates are stored as the first of the month. */
export function monthToDate(month: string): string {
  return `${month}-01`
}

const monthYear = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })

/** "Mar 2024". Dates are calendar dates, so format in UTC to avoid slipping a month. */
export function formatMonthYear(date: string): string {
  return monthYear.format(new Date(`${date.slice(0, 10)}T00:00:00Z`))
}

function monthIndex(date: string): number {
  const [year = 0, month = 1] = date.split('-').map(Number)
  return year * 12 + (month - 1)
}

/** "2 yrs 3 mos", counting both the first and last month, like LinkedIn. */
export function formatTenure(start: string, end: string | null, now: Date = new Date()): string {
  const endIndex = end ? monthIndex(end) : now.getUTCFullYear() * 12 + now.getUTCMonth()
  const months = Math.max(1, endIndex - monthIndex(start) + 1)
  const years = Math.floor(months / 12)
  const rest = months % 12
  const parts = []
  if (years) parts.push(`${years} ${years === 1 ? 'yr' : 'yrs'}`)
  if (rest) parts.push(`${rest} ${rest === 1 ? 'mo' : 'mos'}`)
  return parts.join(' ')
}

/** Current roles first, then most recent end date, then most recent start. */
export function sortExperiences<T extends Pick<Experience, 'start_date' | 'end_date'>>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    if (!a.end_date !== !b.end_date) return a.end_date ? 1 : -1
    const byEnd = (b.end_date ?? '').localeCompare(a.end_date ?? '')
    return byEnd || b.start_date.localeCompare(a.start_date)
  })
}

export type ProfileStep = { key: string; label: string; done: boolean; href: string }

/** The checklist behind "profile strength". Each step feeds the For-you ranking or applications. */
export function profileSteps(
  seeker: Pick<
    SeekerProfile,
    | 'headline'
    | 'location'
    | 'skills'
    | 'resume_path'
    | 'pref_locations'
    | 'pref_remote'
    | 'pref_min_pay'
    | 'pref_experience_level'
    | 'pref_employment_types'
  >,
  experienceCount: number,
): ProfileStep[] {
  const hasPreferences =
    seeker.pref_locations.length > 0 ||
    seeker.pref_min_pay != null ||
    seeker.pref_experience_level != null ||
    seeker.pref_employment_types.length > 0
  return [
    { key: 'headline', label: 'Add a headline', done: Boolean(seeker.headline?.trim()), href: '#about' },
    { key: 'skills', label: 'List your skills', done: seeker.skills.length > 0, href: '#about' },
    { key: 'experience', label: 'Add your experience', done: experienceCount > 0, href: '#experience' },
    { key: 'resume', label: 'Upload your resume', done: Boolean(seeker.resume_path), href: '#resume' },
    { key: 'preferences', label: 'Set job preferences', done: hasPreferences, href: '#preferences' },
  ]
}
