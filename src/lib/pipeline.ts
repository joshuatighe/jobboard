import { APPLICATION_STATUSES, PIPELINE } from '@/lib/constants'
import type { ApplicationEvent, ApplicationStatus } from '@/lib/types'

/**
 * R12/R13: the recruiter's board. One column per pipeline stage, plus "Closed" for candidates who
 * were rejected or withdrew.
 */
export const STAGES = ['applied', 'reviewing', 'interviewing', 'offer', 'closed'] as const
export type Stage = (typeof STAGES)[number]

export const STAGE_LABELS: Record<Stage, string> = {
  applied: 'New',
  reviewing: APPLICATION_STATUSES.reviewing.label,
  interviewing: APPLICATION_STATUSES.interviewing.label,
  offer: APPLICATION_STATUSES.offer.label,
  closed: 'Closed',
}

export function stageOf(status: ApplicationStatus): Stage {
  return status === 'rejected' || status === 'withdrawn' ? 'closed' : status
}

/** A stage from the URL, or null for anything unknown. */
export function parseStage(value: string | null): Stage | null {
  return STAGES.find((stage) => stage === value) ?? null
}

type TimelineEvent = Pick<ApplicationEvent, 'from_status' | 'to_status' | 'created_at'>
type Candidate = { status: ApplicationStatus; created_at: string; events: TimelineEvent[] }

const time = (date: string) => new Date(date).getTime()

/** When the candidate moved into their current status: its latest event, or when they applied. */
export function enteredStatusAt(candidate: Candidate): string {
  return candidate.events
    .filter((event) => event.to_status === candidate.status)
    .reduce((latest, event) => (time(event.created_at) > time(latest) ? event.created_at : latest), candidate.created_at)
}

/** Candidates per stage. Within a stage, whoever has waited there longest comes first. */
export function groupByStage<T extends Candidate>(candidates: T[]): Record<Stage, T[]> {
  const groups: Record<Stage, T[]> = { applied: [], reviewing: [], interviewing: [], offer: [], closed: [] }
  for (const candidate of candidates) groups[stageOf(candidate.status)].push(candidate)
  for (const stage of STAGES) {
    groups[stage].sort((a, b) => time(enteredStatusAt(a)) - time(enteredStatusAt(b)))
  }
  return groups
}

/**
 * Mirrors `check_application_update`: recruiters can't change a withdrawn application, and can't
 * set `withdrawn` themselves. Anything else, forward or back, is allowed.
 */
export function recruiterTargets(status: ApplicationStatus): ApplicationStatus[] {
  if (status === 'withdrawn') return []
  return ([...PIPELINE, 'rejected'] as ApplicationStatus[]).filter((target) => target !== status)
}

/** The next pipeline stage, if there is one. */
export function nextStatus(status: ApplicationStatus): ApplicationStatus | null {
  const index = PIPELINE.indexOf(status)
  return index >= 0 && index < PIPELINE.length - 1 ? (PIPELINE[index + 1] ?? null) : null
}

/**
 * Where "move back" goes: the previous pipeline stage, or for a rejected candidate, the stage they
 * were in when they were rejected (so a rejection can be undone).
 */
export function previousStatus(status: ApplicationStatus, events: TimelineEvent[]): ApplicationStatus | null {
  if (status === 'withdrawn') return null
  if (status === 'rejected') {
    const rejection = [...events]
      .filter((event) => event.to_status === 'rejected')
      .sort((a, b) => time(b.created_at) - time(a.created_at))[0]
    const before = rejection?.from_status
    return before && PIPELINE.includes(before) ? before : 'applied'
  }
  const index = PIPELINE.indexOf(status)
  return index > 0 ? (PIPELINE[index - 1] ?? null) : null
}

/**
 * Outcomes the candidate sees as a decision (an offer, or not being selected) ask first. Moving
 * between review and interview stages is routine and happens straight away.
 */
export function needsConfirmation(target: ApplicationStatus): target is 'offer' | 'rejected' {
  return target === 'offer' || target === 'rejected'
}

/** The verb on a button that moves a candidate to `target`. */
export function moveLabel(target: ApplicationStatus): string {
  switch (target) {
    case 'applied':
      return 'Move back to New'
    case 'reviewing':
      return 'Move to In review'
    case 'interviewing':
      return 'Move to Interviewing'
    case 'offer':
      return 'Mark as offer'
    case 'rejected':
      return 'Reject'
    case 'withdrawn':
      return 'Withdraw'
  }
}

/** A candidate's display name. Profiles can have an empty name, and RLS can hide the profile. */
export function candidateName(applicant: { candidate: { full_name: string } | null }): string {
  return applicant.candidate?.full_name.trim() || 'Unnamed candidate'
}
