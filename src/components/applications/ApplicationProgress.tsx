import { pipelineProgress } from '@/lib/applications'
import { APPLICATION_STATUSES, PIPELINE } from '@/lib/constants'
import type { ApplicationEvent, ApplicationStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

/** A four-step bar showing how far an application has moved through the pipeline (R8). */
export function ApplicationProgress({
  status,
  events,
  className,
}: {
  status: ApplicationStatus
  events: Pick<ApplicationEvent, 'to_status' | 'created_at'>[]
  className?: string
}) {
  const { reached, ended } = pipelineProgress(status, events)
  const stage = APPLICATION_STATUSES[PIPELINE[reached] ?? 'applied'].label
  const label = ended
    ? `${APPLICATION_STATUSES[status].label} after ${stage.toLowerCase()}`
    : `Stage ${reached + 1} of ${PIPELINE.length}: ${stage}`

  return (
    <div role="img" aria-label={label} title={label} className={cn('flex gap-1', className)}>
      {PIPELINE.map((step, index) => (
        <span
          key={step}
          className={cn(
            'h-1.5 flex-1 rounded-full bg-muted transition-colors duration-200',
            index <= reached &&
              (ended ? 'bg-muted-foreground/35' : status === 'offer' ? 'bg-success' : 'bg-brand'),
          )}
        />
      ))}
    </div>
  )
}
