import { describe, expect, it } from 'vitest'

import { buildFeed, listSignals, matchSignals, matchTier, missingSignals } from '@/lib/feed'
import type { MatchableJob, MatchPreferences } from '@/lib/matching'

const prefs = (overrides: Partial<MatchPreferences> = {}): MatchPreferences => ({
  skills: [],
  pref_locations: [],
  pref_remote: true,
  pref_min_pay: null,
  pref_experience_level: null,
  pref_employment_types: [],
  ...overrides,
})

const job = (id: string, overrides: Partial<MatchableJob> = {}) => ({
  id,
  created_at: '2026-10-01T00:00:00Z',
  location: 'San Francisco, CA',
  is_remote: false,
  pay_min: 120_000,
  pay_max: 160_000,
  pay_period: 'year' as const,
  experience_level: 'mid' as const,
  employment_type: 'full_time' as const,
  skills: ['React', 'TypeScript'],
  ...overrides,
})

describe('matchSignals', () => {
  it("doesn't count the default remote preference as a signal", () => {
    expect(matchSignals(prefs())).toEqual([])
    expect(missingSignals(prefs())).toEqual(['level', 'locations', 'pay', 'types', 'skills'])
  })

  it('lists what the seeker filled in', () => {
    const filled = prefs({ pref_experience_level: 'mid', skills: ['React'], pref_min_pay: 0 })
    expect(matchSignals(filled)).toEqual(['level', 'skills'])
    expect(missingSignals(filled)).toEqual(['locations', 'pay', 'types'])
  })
})

describe('listSignals', () => {
  it('joins labels into a readable phrase', () => {
    expect(listSignals([])).toBe('')
    expect(listSignals(['skills'])).toBe('skills')
    expect(listSignals(['level', 'skills'])).toBe('experience level and skills')
    expect(listSignals(['pay', 'types', 'skills'])).toBe('minimum pay, job types and skills')
  })
})

describe('matchTier', () => {
  it('buckets scores at 80 and 50', () => {
    expect(matchTier(100).tone).toBe('strong')
    expect(matchTier(80).tone).toBe('strong')
    expect(matchTier(79).tone).toBe('good')
    expect(matchTier(50).tone).toBe('good')
    expect(matchTier(49).tone).toBe('weak')
    expect(matchTier(0).label).toBe('Partial match')
  })
})

describe('buildFeed', () => {
  const seeker = prefs({ pref_experience_level: 'senior', pref_remote: false, skills: ['React', 'TypeScript'] })

  it('ranks jobs best match first', () => {
    const feed = buildFeed(
      [job('mid'), job('senior', { experience_level: 'senior' })],
      seeker,
      new Set(),
    )
    expect(feed.matches.map((j) => j.id)).toEqual(['senior', 'mid'])
    expect(feed.matches[0]?.match.score).toBe(100)
    expect(feed.appliedCount).toBe(0)
  })

  it('leaves out jobs already applied to and counts them', () => {
    const feed = buildFeed(
      [job('a', { experience_level: 'senior' }), job('b'), job('c')],
      seeker,
      new Set(['a', 'missing']),
    )
    expect(feed.matches.map((j) => j.id)).toEqual(['b', 'c'])
    expect(feed.appliedCount).toBe(1)
  })
})
