import { describe, expect, it } from 'vitest'

import {
  candidateName,
  enteredStatusAt,
  groupByStage,
  moveLabel,
  needsConfirmation,
  nextStatus,
  parseStage,
  previousStatus,
  recruiterTargets,
  stageOf,
} from '@/lib/pipeline'
import type { ApplicationStatus } from '@/lib/types'

const event = (from_status: ApplicationStatus | null, to_status: ApplicationStatus, created_at: string) => ({
  from_status,
  to_status,
  created_at,
})

describe('stageOf / parseStage', () => {
  it('puts rejected and withdrawn candidates in the closed column', () => {
    expect(stageOf('applied')).toBe('applied')
    expect(stageOf('offer')).toBe('offer')
    expect(stageOf('rejected')).toBe('closed')
    expect(stageOf('withdrawn')).toBe('closed')
  })

  it('parses stages from the URL', () => {
    expect(parseStage('interviewing')).toBe('interviewing')
    expect(parseStage('rejected')).toBeNull()
    expect(parseStage(null)).toBeNull()
  })
})

describe('enteredStatusAt / groupByStage', () => {
  const a = {
    id: 'a',
    status: 'reviewing' as const,
    created_at: '2026-09-01T00:00:00Z',
    events: [event(null, 'applied', '2026-09-01T00:00:00Z'), event('applied', 'reviewing', '2026-09-10T00:00:00Z')],
  }
  const b = {
    id: 'b',
    status: 'reviewing' as const,
    created_at: '2026-09-05T00:00:00Z',
    events: [event(null, 'applied', '2026-09-05T00:00:00Z'), event('applied', 'reviewing', '2026-09-06T00:00:00Z')],
  }
  const c = { id: 'c', status: 'withdrawn' as const, created_at: '2026-09-02T00:00:00Z', events: [] }

  it('uses the latest event into the current status, or the application date', () => {
    expect(enteredStatusAt(a)).toBe('2026-09-10T00:00:00Z')
    expect(enteredStatusAt(c)).toBe('2026-09-02T00:00:00Z')
  })

  it('groups by stage, longest-waiting first', () => {
    const groups = groupByStage([a, b, c])
    expect(groups.reviewing.map((x) => x.id)).toEqual(['b', 'a'])
    expect(groups.closed.map((x) => x.id)).toEqual(['c'])
    expect(groups.applied).toEqual([])
  })
})

describe('recruiterTargets', () => {
  it('allows any move except to or from withdrawn', () => {
    expect(recruiterTargets('applied')).toEqual(['reviewing', 'interviewing', 'offer', 'rejected'])
    expect(recruiterTargets('rejected')).toEqual(['applied', 'reviewing', 'interviewing', 'offer'])
    expect(recruiterTargets('offer')).not.toContain('withdrawn')
    expect(recruiterTargets('withdrawn')).toEqual([])
  })
})

describe('nextStatus / previousStatus', () => {
  it('steps through the pipeline', () => {
    expect(nextStatus('applied')).toBe('reviewing')
    expect(nextStatus('interviewing')).toBe('offer')
    expect(nextStatus('offer')).toBeNull()
    expect(nextStatus('rejected')).toBeNull()
    expect(previousStatus('applied', [])).toBeNull()
    expect(previousStatus('offer', [])).toBe('interviewing')
    expect(previousStatus('withdrawn', [])).toBeNull()
  })

  it('undoes a rejection back to the stage it happened at', () => {
    const events = [
      event(null, 'applied', '2026-09-01T00:00:00Z'),
      event('applied', 'interviewing', '2026-09-02T00:00:00Z'),
      event('interviewing', 'rejected', '2026-09-03T00:00:00Z'),
    ]
    expect(previousStatus('rejected', events)).toBe('interviewing')
    expect(previousStatus('rejected', [])).toBe('applied')
  })
})

describe('needsConfirmation / moveLabel', () => {
  it('confirms outcomes the candidate sees as a decision', () => {
    expect(needsConfirmation('rejected')).toBe(true)
    expect(needsConfirmation('offer')).toBe(true)
    expect(needsConfirmation('interviewing')).toBe(false)
  })

  it('labels every move', () => {
    expect(moveLabel('reviewing')).toBe('Move to In review')
    expect(moveLabel('rejected')).toBe('Reject')
  })
})

describe('candidateName', () => {
  it('falls back when the name is empty or hidden', () => {
    expect(candidateName({ candidate: { full_name: ' Priya Shah ' } })).toBe('Priya Shah')
    expect(candidateName({ candidate: { full_name: '' } })).toBe('Unnamed candidate')
    expect(candidateName({ candidate: null })).toBe('Unnamed candidate')
  })
})
