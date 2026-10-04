import { Link } from 'react-router'

import { ApplicantCounts } from '@/components/postings/ApplicantCounts'
import { PostingActionsMenu } from '@/components/postings/PostingActionsMenu'
import { PostingDates } from '@/components/postings/PostingDates'
import { PostingMeta } from '@/components/postings/PostingMeta'
import { PostingStatusBadge } from '@/components/postings/PostingStatusBadge'
import type { Posting } from '@/lib/api/postings'
import { countApplicants, postingHref, type PostingAction } from '@/lib/postings'

/** R11 on mobile: the table row as a card. */
export function PostingCard({
  posting,
  onAction,
}: {
  posting: Posting
  onAction: (action: PostingAction) => void
}) {
  const counts = countApplicants(posting.applications)
  return (
    <article className="relative rounded-xl border bg-card p-4 shadow-xs has-[a[data-row-link]:focus-visible]:ring-[3px] has-[a[data-row-link]:focus-visible]:ring-ring/50">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-1">
            <PostingStatusBadge status={posting.status} />
          </div>
          <h3 className="font-semibold tracking-tight">
            <Link to={postingHref(posting)} data-row-link className="outline-none after:absolute after:inset-0 after:rounded-xl">
              {posting.title}
            </Link>
          </h3>
        </div>
        <PostingActionsMenu posting={posting} applicantCount={counts.total} onAction={onAction} />
      </div>
      <PostingMeta posting={posting} />
      <div className="mt-3 flex flex-wrap items-end justify-between gap-x-4 gap-y-2 border-t pt-3">
        {posting.status === 'draft' ? (
          <p className="text-sm text-muted-foreground">Not published</p>
        ) : (
          <ApplicantCounts counts={counts} />
        )}
        <PostingDates posting={posting} className="relative z-10 text-xs text-muted-foreground" />
      </div>
    </article>
  )
}
