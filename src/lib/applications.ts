import { PIPELINE } from '@/lib/constants'
import type { ApplicationEvent, ApplicationStatus } from '@/lib/types'

/**
 * R8: how the application tracker groups statuses. "Active" is still in play, "Offers" needs a
 * decision, "Closed" is finished either way.
 */
export const APPLICATION_GROUPS = {
  active: { label: 'Active', statuses: ['applied', 'reviewing', 'interviewing'] },
  offers: { label: 'Offers', statuses: ['offer'] },
  closed: { label: 'Closed', statuses: ['rejected', 'withdrawn'] },
} as const satisfies Record<string, { label: string; statuses: ApplicationStatus[] }>

export type ApplicationGroup = keyof typeof APPLICATION_GROUPS

/** The tracker's tabs, in order. `all` shows every application. */
export const TRACKER_TABS = ['all', 'active', 'offers', 'closed'] as const
export type TrackerTab = (typeof TRACKER_TABS)[number]

export function groupOf(status: ApplicationStatus): ApplicationGroup {
  if (status === 'offer') return 'offers'
  if (status === 'rejected' || status === 'withdrawn') return 'closed'
  return 'active'
}

/** A tab from the URL, falling back to `all` for anything unknown. */
export function parseTrackerTab(value: string | null): TrackerTab {
  return TRACKER_TABS.find((tab) => tab === value) ?? 'all'
}

/** Mirrors `check_application_update`: seekers can withdraw anything that isn't already final. */
export function canWithdraw(status: ApplicationStatus): boolean {
  return status !== 'rejected' && status !== 'withdrawn'
}

export function countByTab(applications: { status: ApplicationStatus }[]): Record<TrackerTab, number> {
  const counts: Record<TrackerTab, number> = { all: applications.length, active: 0, offers: 0, closed: 0 }
  for (const { status } of applications) counts[groupOf(status)] += 1
  return counts
}

export function inTab(status: ApplicationStatus, tab: TrackerTab): boolean {
  return tab === 'all' || groupOf(status) === tab
}

type TimelineEvent = Pick<ApplicationEvent, 'to_status' | 'created_at'>

/** Oldest first, so the timeline reads top to bottom. */
export function sortTimeline<T extends TimelineEvent>(events: T[]): T[] {
  return [...events].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  )
}

/**
 * When the application last changed: its newest status event, or when it was sent. Events are the
 * record of status changes, so they're more trustworthy than `updated_at` for "last update".
 */
export function lastActivity(application: { created_at: string; events: TimelineEvent[] }): string {
  return application.events.reduce(
    (latest, event) =>
      new Date(event.created_at).getTime() > new Date(latest).getTime() ? event.created_at : latest,
    application.created_at,
  )
}

/** Most recently active first. */
export function sortByActivity<T extends { created_at: string; events: TimelineEvent[] }>(
  applications: T[],
): T[] {
  return applications
    .map((application) => ({ application, at: new Date(lastActivity(application)).getTime() }))
    .sort((a, b) => b.at - a.at)
    .map(({ application }) => application)
}

export type PipelineProgress = {
  /** Index into `PIPELINE` of the furthest stage reached (0 = applied). */
  reached: number
  /** Set when the application ended before (or instead of) moving on. */
  ended?: 'rejected' | 'withdrawn'
}

/**
 * How far an application got through the pipeline. For a rejected or withdrawn application this
 * is the furthest stage it reached before it ended, taken from its timeline.
 */
export function pipelineProgress(status: ApplicationStatus, events: TimelineEvent[]): PipelineProgress {
  const current = PIPELINE.indexOf(status)
  if (current >= 0) return { reached: current }

  const reached = events.reduce((furthest, event) => Math.max(furthest, PIPELINE.indexOf(event.to_status)), 0)
  return { reached, ended: status === 'rejected' ? 'rejected' : 'withdrawn' }
}
