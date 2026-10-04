import { Link } from 'react-router'

import { ApplicantCounts } from '@/components/postings/ApplicantCounts'
import { PostingActionsMenu } from '@/components/postings/PostingActionsMenu'
import { PostingDates } from '@/components/postings/PostingDates'
import { PostingMeta } from '@/components/postings/PostingMeta'
import { PostingStatusBadge } from '@/components/postings/PostingStatusBadge'
import type { Posting } from '@/lib/api/postings'
import { countApplicants, postingHref, type PostingAction } from '@/lib/postings'

/** R11 on mobile: the table row as one listing. The parent list rules between rows. */
export function PostingCard({
  posting,
  onAction,
}: {
  posting: Posting
  onAction: (action: PostingAction) => void
}) {
  const counts = countApplicants(posting.applications)
  return (
    <article className="relative py-5 has-[a[data-row-link]:focus-visible]:ring-2 has-[a[data-row-link]:focus-visible]:ring-ring has-[a[data-row-link]:focus-visible]:ring-inset">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-2">
            <PostingStatusBadge status={posting.status} />
          </div>
          <h3 className="text-xl leading-tight">
            <Link to={postingHref(posting)} data-row-link className="outline-none after:absolute after:inset-0">
              {posting.title}
            </Link>
          </h3>
        </div>
        <PostingActionsMenu posting={posting} applicantCount={counts.total} onAction={onAction} />
      </div>
      <PostingMeta posting={posting} />
      <div className="mt-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
        {posting.status === 'draft' ? (
          <p className="text-sm text-muted-foreground">Not published</p>
        ) : (
          <ApplicantCounts counts={counts} />
        )}
        <PostingDates posting={posting} className="relative z-10 meta text-muted-foreground" />
      </div>
    </article>
  )
}
