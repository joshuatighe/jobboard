import { MapPin } from 'lucide-react'

import { JobBadges } from '@/components/jobs/JobBadges'
import type { Posting } from '@/lib/api/postings'
import { formatPay } from '@/lib/format'

/** Location, pay, level, type and remote for a posting in a list. */
export function PostingMeta({ posting }: { posting: Posting }) {
  return (
    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-muted-foreground">
      <span className="inline-flex items-center gap-1">
        <MapPin className="size-3.5" />
        {posting.location}
      </span>
      <span className="font-medium text-foreground/80 tabular-nums">{formatPay(posting)}</span>
      <span className="flex flex-wrap gap-1.5">
        <JobBadges job={posting} />
      </span>
    </div>
  )
}
