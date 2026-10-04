import { Link } from 'react-router'

import { ApplicantCounts } from '@/components/postings/ApplicantCounts'
import { PostingActionsMenu } from '@/components/postings/PostingActionsMenu'
import { PostingDates } from '@/components/postings/PostingDates'
import { PostingMeta } from '@/components/postings/PostingMeta'
import { PostingStatusBadge } from '@/components/postings/PostingStatusBadge'
import type { Posting } from '@/lib/api/postings'
import { countApplicants, postingHref, type PostingAction } from '@/lib/postings'

/** R11 on desktop: one dense row per posting. */
export function PostingsTable({
  postings,
  onAction,
}: {
  postings: Posting[]
  onAction: (posting: Posting, action: PostingAction) => void
}) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-xs">
      <table className="w-full text-left text-sm">
        <thead className="border-b bg-muted/40 text-xs text-muted-foreground">
          <tr>
            <th scope="col" className="px-4 py-2.5 font-medium">Posting</th>
            <th scope="col" className="px-4 py-2.5 font-medium">Status</th>
            <th scope="col" className="px-4 py-2.5 font-medium">Applicants</th>
            <th scope="col" className="px-4 py-2.5 font-medium">Activity</th>
            <th scope="col" className="w-12 px-2 py-2.5">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {postings.map((posting) => {
            const counts = countApplicants(posting.applications)
            return (
              <tr
                key={posting.id}
                className="relative align-top transition-colors duration-150 hover:bg-muted/30 has-[a[data-row-link]:focus-visible]:ring-[3px] has-[a[data-row-link]:focus-visible]:ring-ring/50 has-[a[data-row-link]:focus-visible]:ring-inset"
              >
                <td className="max-w-0 px-4 py-3.5 lg:w-[46%]">
                  <Link
                    to={postingHref(posting)}
                    data-row-link
                    className="font-semibold tracking-tight outline-none after:absolute after:inset-0 hover:text-brand"
                  >
                    {posting.title}
                  </Link>
                  <PostingMeta posting={posting} />
                </td>
                <td className="px-4 py-3.5">
                  <PostingStatusBadge status={posting.status} />
                </td>
                <td className="px-4 py-3.5">
                  {posting.status === 'draft' ? (
                    <p className="text-sm text-muted-foreground">Not published</p>
                  ) : (
                    <ApplicantCounts counts={counts} />
                  )}
                </td>
                <td className="relative z-10 px-4 py-3.5 text-xs text-muted-foreground">
                  <PostingDates posting={posting} stacked />
                </td>
                <td className="px-2 py-3">
                  <PostingActionsMenu
                    posting={posting}
                    applicantCount={counts.total}
                    onAction={(action) => onAction(posting, action)}
                  />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
