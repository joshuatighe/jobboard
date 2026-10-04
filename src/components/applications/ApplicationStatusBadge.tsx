import { Badge } from '@/components/ui/badge'
import { APPLICATION_STATUSES } from '@/lib/constants'
import type { ApplicationStatus } from '@/lib/types'

/** The one place application statuses get their label and color. */
export function ApplicationStatusBadge({ status }: { status: ApplicationStatus }) {
  const { label, tone } = APPLICATION_STATUSES[status]
  return <Badge variant={tone}>{label}</Badge>
}
