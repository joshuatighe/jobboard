import { EXPERIENCE_LEVELS, HOURS_PER_YEAR } from '@/lib/constants'
import type { Job, SeekerProfile } from '@/lib/types'

/**
 * R6: Personalized feed scoring.
 *
 * Each criterion the seeker has filled in contributes its weight to the possible total. The score
 * is the share of that total the job earns, from 0 to 100. Criteria the seeker left blank are
 * skipped instead of counting against the job.
 */
export const MATCH_WEIGHTS = {
  experience: 25,
  location: 25,
  pay: 20,
  employmentType: 10,
  skills: 20,
} as const

export type MatchCriterion = keyof typeof MATCH_WEIGHTS

export type MatchReason = { criterion: MatchCriterion; label: string }

export type MatchResult = {
  /** 0–100, rounded. */
  score: number
  /** Human-readable reasons the job matched, strongest first. */
  reasons: MatchReason[]
}

export type MatchPreferences = Pick<
  SeekerProfile,
  | 'skills'
  | 'pref_locations'
  | 'pref_remote'
  | 'pref_min_pay'
  | 'pref_experience_level'
  | 'pref_employment_types'
>

export type MatchableJob = Pick<
  Job,
  | 'location'
  | 'is_remote'
  | 'pay_min'
  | 'pay_max'
  | 'pay_period'
  | 'experience_level'
  | 'employment_type'
  | 'skills'
>

const levelIndex = (level: Job['experience_level']) =>
  EXPERIENCE_LEVELS.findIndex((l) => l.value === level)

const normalize = (value: string) => value.trim().toLowerCase()

/** Annual pay, so hourly and salaried roles compare fairly. */
export function annualize(amount: number, period: Job['pay_period']): number {
  return period === 'hour' ? amount * HOURS_PER_YEAR : amount
}

export function scoreJob(job: MatchableJob, prefs: MatchPreferences): MatchResult {
  let earned = 0
  let possible = 0
  const reasons: (MatchReason & { points: number })[] = []

  const award = (criterion: MatchCriterion, fraction: number, label: string) => {
    const points = MATCH_WEIGHTS[criterion] * fraction
    earned += points
    if (points > 0) reasons.push({ criterion, label, points })
  }

  if (prefs.pref_experience_level) {
    possible += MATCH_WEIGHTS.experience
    const distance = Math.abs(levelIndex(job.experience_level) - levelIndex(prefs.pref_experience_level))
    if (distance === 0) award('experience', 1, 'Your level')
    else if (distance === 1) award('experience', 0.5, 'Near your level')
  }

  const wantsLocations = prefs.pref_locations.length > 0
  if (wantsLocations || prefs.pref_remote) {
    possible += MATCH_WEIGHTS.location
    const jobLocation = normalize(job.location)
    const locationHit =
      wantsLocations &&
      prefs.pref_locations.some((loc) => {
        const wanted = normalize(loc)
        return wanted.length > 0 && (jobLocation.includes(wanted) || wanted.includes(jobLocation))
      })
    if (job.is_remote && prefs.pref_remote) award('location', 1, 'Remote')
    else if (locationHit) award('location', 1, job.location)
  }

  if (prefs.pref_min_pay != null && prefs.pref_min_pay > 0) {
    possible += MATCH_WEIGHTS.pay
    if (annualize(job.pay_max, job.pay_period) >= prefs.pref_min_pay) {
      award('pay', 1, 'Meets your pay')
    }
  }

  if (prefs.pref_employment_types.length > 0) {
    possible += MATCH_WEIGHTS.employmentType
    if (prefs.pref_employment_types.includes(job.employment_type)) {
      award('employmentType', 1, 'Preferred job type')
    }
  }

  if (prefs.skills.length > 0 && job.skills.length > 0) {
    possible += MATCH_WEIGHTS.skills
    const mine = new Set(prefs.skills.map(normalize))
    const overlap = job.skills.filter((skill) => mine.has(normalize(skill))).length
    if (overlap > 0) {
      // Three shared skills (or all of them, for short lists) is a full skills match.
      const fraction = Math.min(1, overlap / Math.min(3, job.skills.length))
      award('skills', fraction, `${overlap} matching skill${overlap === 1 ? '' : 's'}`)
    }
  }

  return {
    score: possible === 0 ? 0 : Math.round((earned / possible) * 100),
    reasons: reasons
      .sort((a, b) => b.points - a.points)
      .map(({ criterion, label }) => ({ criterion, label })),
  }
}

/** Score and sort jobs best match first. Ties go to the newer posting. */
export function rankJobs<T extends MatchableJob & Pick<Job, 'created_at'>>(
  jobs: T[],
  prefs: MatchPreferences,
): (T & { match: MatchResult })[] {
  return jobs
    .map((job) => ({ ...job, match: scoreJob(job, prefs) }))
    .sort(
      (a, b) =>
        b.match.score - a.match.score ||
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
}
