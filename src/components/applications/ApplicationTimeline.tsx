import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { sortTimeline } from '@/lib/applications'
import { APPLICATION_STATUSES } from '@/lib/constants'
import { formatDate, formatRelative } from '@/lib/format'
import type { ApplicationEvent } from '@/lib/types'
import { cn } from '@/lib/utils'

type TimelineEvent = Pick<ApplicationEvent, 'id' | 'to_status' | 'changed_by' | 'created_at'>

type Tone = (typeof APPLICATION_STATUSES)[keyof typeof APPLICATION_STATUSES]['tone']

/** The latest event's dot takes its status color, matching the status badge. */
const DOT_TONE: Record<Tone, string> = {
  warning: 'bg-warning',
  secondary: 'bg-muted-foreground',
  info: 'bg-info',
  brand: 'bg-brand',
  success: 'bg-success',
  destructive: 'bg-destructive',
  outline: 'bg-muted-foreground/50',
}

/** R8/R13: every status change on an application, oldest first. */
export function ApplicationTimeline({
  events,
  seekerId,
}: {
  events: TimelineEvent[]
  seekerId: string
}) {
  const items = sortTimeline(events)
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">No activity recorded yet.</p>
  }

  return (
    <ol className="relative">
      {items.map((event, index) => {
        const { label, tone, description } = APPLICATION_STATUSES[event.to_status]
        const latest = index === items.length - 1
        return (
          <li key={event.id} className="relative flex gap-3 pb-5 last:pb-0">
            {!latest && (
              <span aria-hidden className="absolute top-4 bottom-0 left-[5px] w-px bg-border" />
            )}
            <span
              aria-hidden
              className={cn(
                'relative mt-1.5 size-[11px] shrink-0 rounded-full ring-4 ring-background',
                latest ? DOT_TONE[tone] : 'bg-border',
              )}
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <p className={cn('text-sm font-medium', !latest && 'text-muted-foreground')}>
                  {event.to_status === 'applied' ? 'Application sent' : label}
                  {event.to_status === 'withdrawn' && event.changed_by === seekerId && ' by you'}
                </p>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <time dateTime={event.created_at} className="text-xs whitespace-nowrap text-muted-foreground">
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
