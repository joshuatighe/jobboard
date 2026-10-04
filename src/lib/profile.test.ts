import { describe, expect, it } from 'vitest'

import {
  formatMonthYear,
  formatTenure,
  monthToDate,
  profileSteps,
  sortExperiences,
  toMonthValue,
} from '@/lib/profile'

describe('month values', () => {
  it('round-trips between dates and month values', () => {
    expect(toMonthValue('2024-03-01')).toBe('2024-03')
    expect(toMonthValue(null)).toBe('')
    expect(monthToDate('2024-03')).toBe('2024-03-01')
  })

  it('formats the calendar month regardless of time zone', () => {
    expect(formatMonthYear('2024-03-01')).toBe('Mar 2024')
    expect(formatMonthYear('2024-01-01')).toBe('Jan 2024')
  })
})

describe('formatTenure', () => {
  it('counts the first and last month', () => {
    expect(formatTenure('2024-01-01', '2024-01-01')).toBe('1 mo')
    expect(formatTenure('2024-01-01', '2024-12-01')).toBe('1 yr')
    expect(formatTenure('2022-01-01', '2024-03-01')).toBe('2 yrs 3 mos')
  })

  it('runs to today for current roles', () => {
    expect(formatTenure('2026-05-01', null, new Date('2026-10-04T12:00:00Z'))).toBe('6 mos')
  })
})

describe('sortExperiences', () => {
  it('puts current roles first, then the most recent', () => {
    const items = [
      { id: 'old', start_date: '2018-01-01', end_date: '2020-01-01' },
      { id: 'recent', start_date: '2020-02-01', end_date: '2023-06-01' },
      { id: 'current', start_date: '2023-07-01', end_date: null },
    ]
    expect(sortExperiences(items).map((e) => e.id)).toEqual(['current', 'recent', 'old'])
  })
})

describe('profileSteps', () => {
  const empty = {
    headline: null,
    location: null,
    skills: [],
    resume_path: null,
    pref_locations: [],
    pref_remote: true,
    pref_min_pay: null,
    pref_experience_level: null,
    pref_employment_types: [],
  }

  it('starts with nothing done', () => {
    expect(profileSteps(empty, 0).filter((s) => s.done)).toEqual([])
  })

  it('marks steps done as the profile fills in', () => {
    const steps = profileSteps(
      { ...empty, headline: 'Engineer', skills: ['React'], resume_path: 'u/r.pdf', pref_min_pay: 1 },
      2,
    )
    expect(steps.every((s) => s.done)).toBe(true)
  })

  it('ignores a blank headline', () => {
    expect(profileSteps({ ...empty, headline: '  ' }, 0)[0]?.done).toBe(false)
  })
})
