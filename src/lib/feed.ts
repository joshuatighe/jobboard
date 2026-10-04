import { rankJobs, type MatchableJob, type MatchPreferences, type MatchResult } from '@/lib/matching'
import type { Job } from '@/lib/types'

/**
 * R6: what the For-you feed ranks on, and how it presents a score. Scoring itself lives in
 * `matching.ts`; this decides what's worth showing.
 */

export type MatchSignal = 'level' | 'locations' | 'pay' | 'types' | 'skills'

export const MATCH_SIGNAL_LABELS: Record<MatchSignal, string> = {
  level: 'experience level',
  locations: 'locations',
  pay: 'minimum pay',
  types: 'job types',
  skills: 'skills',
}

/**
 * The preferences the seeker actually filled in. "Remote OK" doesn't count on its own: it's on by
 * default, so it says nothing about what this person wants.
 */
export function matchSignals(prefs: MatchPreferences): MatchSignal[] {
  const signals: MatchSignal[] = []
  if (prefs.pref_experience_level) signals.push('level')
  if (prefs.pref_locations.length > 0) signals.push('locations')
  if (prefs.pref_min_pay != null && prefs.pref_min_pay > 0) signals.push('pay')
  if (prefs.pref_employment_types.length > 0) signals.push('types')
  if (prefs.skills.length > 0) signals.push('skills')
  return signals
}

/** The signals still missing, in the order the profile asks for them. */
export function missingSignals(prefs: MatchPreferences): MatchSignal[] {
  const have = new Set(matchSignals(prefs))
  return (Object.keys(MATCH_SIGNAL_LABELS) as MatchSignal[]).filter((signal) => !have.has(signal))
}

/** "skills", "level and skills", "pay, job types and skills". */
export function listSignals(signals: MatchSignal[]): string {
  const labels = signals.map((s) => MATCH_SIGNAL_LABELS[s])
  if (labels.length <= 1) return labels.join('')
  return `${labels.slice(0, -1).join(', ')} and ${labels.at(-1)}`
}

export type MatchTier = { label: string; tone: 'strong' | 'good' | 'weak' }

/** How a score reads in the UI. Thresholds are deliberately coarse; the number carries the rest. */
export function matchTier(score: number): MatchTier {
  if (score >= 80) return { label: 'Strong match', tone: 'strong' }
  if (score >= 50) return { label: 'Good match', tone: 'good' }
  return { label: 'Partial match', tone: 'weak' }
}

export type Feed<T> = {
  /** Jobs not yet applied to, best match first. */
  matches: (T & { match: MatchResult })[]
  /** How many open jobs were left out because the seeker already applied. */
  appliedCount: number
}

/** Rank open jobs for the seeker and set aside the ones they've already applied to. */
export function buildFeed<T extends MatchableJob & Pick<Job, 'id' | 'created_at'>>(
  jobs: T[],
  prefs: MatchPreferences,
  appliedJobIds: ReadonlySet<string>,
): Feed<T> {
  const fresh = jobs.filter((job) => !appliedJobIds.has(job.id))
  return { matches: rankJobs(fresh, prefs), appliedCount: jobs.length - fresh.length }
}
