import { describe, expect, it } from 'vitest'

import {
  canWithdraw,
  countByTab,
  groupOf,
  inTab,
  lastActivity,
  parseTrackerTab,
  pipelineProgress,
  sortByActivity,
  sortTimeline,
} from '@/lib/applications'
import type { ApplicationStatus } from '@/lib/types'

const event = (to_status: ApplicationStatus, created_at: string) => ({ to_status, created_at })

describe('groupOf / inTab', () => {
  it('puts every status in exactly one group', () => {
    expect(groupOf('applied')).toBe('active')
    expect(groupOf('reviewing')).toBe('active')
    expect(groupOf('interviewing')).toBe('active')
    expect(groupOf('offer')).toBe('offers')
    expect(groupOf('rejected')).toBe('closed')
    expect(groupOf('withdrawn')).toBe('closed')
  })

  it('shows everything on the all tab', () => {
    expect(inTab('withdrawn', 'all')).toBe(true)
    expect(inTab('offer', 'active')).toBe(false)
    expect(inTab('offer', 'offers')).toBe(true)
  })
})

describe('parseTrackerTab', () => {
  it('accepts known tabs and falls back to all', () => {
    expect(parseTrackerTab('offers')).toBe('offers')
    expect(parseTrackerTab(null)).toBe('all')
    expect(parseTrackerTab('nonsense')).toBe('all')
  })
})

describe('canWithdraw', () => {
  it('matches the database rule: anything not already final', () => {
    expect(canWithdraw('applied')).toBe(true)
    expect(canWithdraw('interviewing')).toBe(true)
    expect(canWithdraw('offer')).toBe(true)
    expect(canWithdraw('rejected')).toBe(false)
    expect(canWithdraw('withdrawn')).toBe(false)
  })
})

describe('countByTab', () => {
  it('counts each group and the total', () => {
    const statuses: ApplicationStatus[] = ['applied', 'reviewing', 'offer', 'rejected', 'withdrawn']
    expect(countByTab(statuses.map((status) => ({ status })))).toEqual({
      all: 5,
      active: 2,
      offers: 1,
      closed: 2,
    })
  })

  it('handles no applications', () => {
    expect(countByTab([])).toEqual({ all: 0, active: 0, offers: 0, closed: 0 })
  })
})

describe('timeline helpers', () => {
  const events = [
    event('interviewing', '2026-10-03T10:00:00Z'),
    event('applied', '2026-09-28T10:00:00Z'),
    event('reviewing', '2026-09-30T10:00:00Z'),
  ]

  it('sorts oldest first without mutating', () => {
    const sorted = sortTimeline(events)
    expect(sorted.map((e) => e.to_status)).toEqual(['applied', 'reviewing', 'interviewing'])
    expect(events[0]?.to_status).toBe('interviewing')
  })

  it('takes the newest event as the last activity', () => {
    expect(lastActivity({ created_at: '2026-09-28T10:00:00Z', events })).toBe('2026-10-03T10:00:00Z')
  })

  it('falls back to the sent date without events', () => {
    expect(lastActivity({ created_at: '2026-09-28T10:00:00Z', events: [] })).toBe('2026-09-28T10:00:00Z')
  })

  it('orders applications by most recent activity', () => {
    const quiet = { id: 'quiet', created_at: '2026-10-01T00:00:00Z', events: [] }
    const busy = { id: 'busy', created_at: '2026-09-01T00:00:00Z', events }
    expect(sortByActivity([quiet, busy]).map((a) => a.id)).toEqual(['busy', 'quiet'])
  })
})

describe('pipelineProgress', () => {
  it('uses the current stage for active applications', () => {
    expect(pipelineProgress('applied', [])).toEqual({ reached: 0 })
    expect(pipelineProgress('offer', [])).toEqual({ reached: 3 })
  })

  it('finds the furthest stage reached before a rejection', () => {
    const events = [event('applied', 'a'), event('reviewing', 'b'), event('interviewing', 'c'), event('rejected', 'd')]
    expect(pipelineProgress('rejected', events)).toEqual({ reached: 2, ended: 'rejected' })
  })

  it('treats a withdrawal straight after applying as stage zero', () => {
    expect(pipelineProgress('withdrawn', [event('applied', 'a'), event('withdrawn', 'b')])).toEqual({
      reached: 0,
      ended: 'withdrawn',
    })
  })
})
