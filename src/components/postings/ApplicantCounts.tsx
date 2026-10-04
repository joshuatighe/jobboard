import { APPLICATION_STATUSES } from '@/lib/constants'
import type { ApplicantCounts as Counts } from '@/lib/postings'
import { cn } from '@/lib/utils'

const BREAKDOWN = ['applied', 'reviewing', 'interviewing', 'offer'] as const

const SHORT_LABEL: Record<(typeof BREAKDOWN)[number], string> = {
  applied: 'new',
  reviewing: 'in review',
  interviewing: 'interviewing',
  offer: APPLICATION_STATUSES.offer.label.toLowerCase(),
}

/** R11: how many people applied, and where the ones still in play stand. */
export function ApplicantCounts({ counts, className }: { counts: Counts; className?: string }) {
  if (counts.total === 0) {
    return <p className={cn('text-sm text-muted-foreground', className)}>No applicants yet</p>
  }

  const parts = BREAKDOWN.filter((status) => counts[status] > 0)

  return (
    <div className={cn('space-y-0.5', className)}>
      <p className="text-sm font-medium tabular-nums">
        {counts.total} {counts.total === 1 ? 'applicant' : 'applicants'}
      </p>
      {parts.length > 0 && (
        <p className="flex flex-wrap gap-x-2 text-xs text-muted-foreground tabular-nums">
          {parts.map((status) => (
            <span key={status} className={cn(status === 'applied' && 'font-medium text-brand')}>
              {counts[status]} {SHORT_LABEL[status]}
            </span>
          ))}
        </p>
      )}
    </div>
  )
}
