import { Badge } from '@/components/ui/badge'
import { JOB_STATUSES } from '@/lib/constants'
import type { JobStatus } from '@/lib/types'

/** The one place posting statuses get their label and color. */
export function PostingStatusBadge({ status }: { status: JobStatus }) {
  const { label, tone } = JOB_STATUSES[status]
  return (
    <Badge variant={tone}>
      {status === 'open' && <span aria-hidden className="size-1.5 bg-current" />}
      {label}
    </Badge>
  )
}
