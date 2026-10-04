import { describe, expect, it } from 'vitest'

import { rankJobs, scoreJob, type MatchableJob, type MatchPreferences } from '@/lib/matching'

const job = (overrides: Partial<MatchableJob> = {}): MatchableJob => ({
  location: 'San Francisco, CA',
  is_remote: false,
  pay_min: 120_000,
  pay_max: 160_000,
  pay_period: 'year',
  experience_level: 'mid',
  employment_type: 'full_time',
  skills: ['React', 'TypeScript', 'Postgres'],
  ...overrides,
})

const prefs = (overrides: Partial<MatchPreferences> = {}): MatchPreferences => ({
  skills: [],
  pref_locations: [],
  pref_remote: false,
  pref_min_pay: null,
  pref_experience_level: null,
  pref_employment_types: [],
  ...overrides,
})

describe('scoreJob', () => {
  it('scores 0 with no reasons when the seeker has no preferences', () => {
    expect(scoreJob(job(), prefs())).toEqual({ score: 0, reasons: [] })
  })

  it('scores 100 when every stated preference matches', () => {
    const result = scoreJob(
      job(),
      prefs({
        skills: ['react', 'typescript', 'postgres'],
        pref_locations: ['San Francisco'],
        pref_min_pay: 150_000,
        pref_experience_level: 'mid',
        pref_employment_types: ['full_time'],
      }),
    )
    expect(result.score).toBe(100)
    expect(result.reasons.map((r) => r.criterion)).toEqual([
      'experience',
      'location',
      'pay',
      'skills',
      'employmentType',
    ])
  })

  it('only counts criteria the seeker filled in', () => {
    expect(scoreJob(job(), prefs({ pref_experience_level: 'mid' })).score).toBe(100)
    expect(scoreJob(job(), prefs({ pref_experience_level: 'lead' })).score).toBe(0)
  })

  it('gives half credit for an adjacent experience level', () => {
    expect(scoreJob(job(), prefs({ pref_experience_level: 'senior' })).score).toBe(50)
  })

  it('matches remote jobs for seekers open to remote', () => {
    const result = scoreJob(job({ is_remote: true, location: 'Remote (US)' }), prefs({ pref_remote: true }))
    expect(result.score).toBe(100)
    expect(result.reasons[0]?.label).toBe('Remote')
  })

  it('annualizes hourly pay before comparing to the minimum', () => {
    const hourly = job({ pay_min: 50, pay_max: 60, pay_period: 'hour' }) // ≈ $124.8k/yr
    expect(scoreJob(hourly, prefs({ pref_min_pay: 120_000 })).score).toBe(100)
    expect(scoreJob(hourly, prefs({ pref_min_pay: 130_000 })).score).toBe(0)
  })

  it('scales skills credit by overlap', () => {
    expect(scoreJob(job(), prefs({ skills: ['React'] })).score).toBe(33)
    expect(scoreJob(job(), prefs({ skills: ['React'] })).reasons[0]?.label).toBe('1 matching skill')
  })
})

describe('rankJobs', () => {
  it('sorts by score, then by recency', () => {
    const ranked = rankJobs(
      [
        { ...job({ experience_level: 'lead' }), id: 'poor', created_at: '2026-10-03' },
        { ...job(), id: 'old', created_at: '2026-09-01' },
        { ...job(), id: 'new', created_at: '2026-10-01' },
      ],
      prefs({ pref_experience_level: 'mid' }),
    )
    expect(ranked.map((j) => j.id)).toEqual(['new', 'old', 'poor'])
  })
})
