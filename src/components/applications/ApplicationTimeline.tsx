import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { sortTimeline } from '@/lib/applications'
import { APPLICATION_STATUSES } from '@/lib/constants'
import { formatDate, formatRelative } from '@/lib/format'
import type { ApplicationEvent, ApplicationStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

type TimelineEvent = Pick<ApplicationEvent, 'id' | 'to_status' | 'changed_by' | 'created_at'>

type Tone = (typeof APPLICATION_STATUSES)[keyof typeof APPLICATION_STATUSES]['tone']

/** The latest event's dot takes its status color, matching the status badge. */
const DOT_TONE: Record<Tone, string> = {
  warning: 'bg-warning',
  secondary: 'bg-muted-foreground',
  info: 'bg-info',
  highlight: 'bg-highlight ring-1 ring-foreground/60',
  success: 'bg-success',
  destructive: 'bg-destructive',
  outline: 'bg-muted-foreground/50',
}

/** How each status reads to the recruiter, where `APPLICATION_STATUSES` speaks to the candidate. */
const RECRUITER_DESCRIPTIONS: Record<ApplicationStatus, string> = {
  applied: 'New, waiting for someone to review it',
  reviewing: 'Your team is reviewing the application',
  interviewing: 'In your interview process',
  offer: 'You made an offer',
  rejected: 'Marked as not selected. The candidate sees this.',
  withdrawn: 'The candidate withdrew. It can no longer be changed.',
}

/**
 * R8/R13: every status change on an application, oldest first. The candidate (`audience="seeker"`)
 * and the recruiter see the same events, worded for each.
 */
export function ApplicationTimeline({
  events,
  seekerId,
  audience = 'seeker',
}: {
  events: TimelineEvent[]
  seekerId: string
  audience?: 'seeker' | 'recruiter'
}) {
  const items = sortTimeline(events)
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">No activity recorded yet.</p>
  }

  return (
    <ol className="relative">
      {items.map((event, index) => {
        const { label, tone } = APPLICATION_STATUSES[event.to_status]
        const description =
          audience === 'recruiter'
            ? RECRUITER_DESCRIPTIONS[event.to_status]
            : APPLICATION_STATUSES[event.to_status].description
        const latest = index === items.length - 1
        return (
          <li key={event.id} className="relative flex gap-3 pb-5 last:pb-0">
            {!latest && (
              <span aria-hidden className="absolute top-4 bottom-0 left-[5px] w-px bg-border" />
            )}
            <span
              aria-hidden
              className={cn(
                'relative mt-1.5 size-[11px] shrink-0 rounded-full outline-4 outline-background',
                latest ? DOT_TONE[tone] : 'bg-border',
              )}
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <p className={cn('text-sm font-medium', !latest && 'text-muted-foreground')}>
                  {event.to_status === 'applied' ? (audience === 'recruiter' ? 'Applied' : 'Application sent') : label}
                  {event.to_status === 'withdrawn' &&
                    event.changed_by === seekerId &&
                    (audience === 'recruiter' ? ' by the candidate' : ' by you')}
                </p>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <time dateTime={event.created_at} className="meta whitespace-nowrap text-muted-foreground">
                      {formatRelative(event.created_at)}
                    </time>
                  </TooltipTrigger>
                  <TooltipContent>{formatDate(event.created_at)}</TooltipContent>
                </Tooltip>
              </div>
              {latest && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
