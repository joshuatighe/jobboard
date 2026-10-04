import { Link } from 'react-router'

import { ApplicantCounts } from '@/components/postings/ApplicantCounts'
import { PostingActionsMenu } from '@/components/postings/PostingActionsMenu'
import { PostingDates } from '@/components/postings/PostingDates'
import { PostingMeta } from '@/components/postings/PostingMeta'
import { PostingStatusBadge } from '@/components/postings/PostingStatusBadge'
import type { Posting } from '@/lib/api/postings'
import { countApplicants, postingHref, type PostingAction } from '@/lib/postings'

/** R11 on desktop: one dense row per posting, ruled like a ledger. */
export function PostingsTable({
  postings,
  onAction,
}: {
  postings: Posting[]
  onAction: (posting: Posting, action: PostingAction) => void
}) {
  return (
    <table className="w-full border-b text-left text-sm">
      <thead className="border-b meta text-muted-foreground">
        <tr>
          <th scope="col" className="py-2.5 pr-4 font-medium">Posting</th>
          <th scope="col" className="px-4 py-2.5 font-medium">Status</th>
          <th scope="col" className="px-4 py-2.5 font-medium">Applicants</th>
          <th scope="col" className="px-4 py-2.5 font-medium">Activity</th>
          <th scope="col" className="w-10 py-2.5 pl-2">
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
              className="group relative align-top has-[a[data-row-link]:focus-visible]:ring-2 has-[a[data-row-link]:focus-visible]:ring-ring has-[a[data-row-link]:focus-visible]:ring-inset"
            >
              <td className="max-w-0 py-4 pr-4 lg:w-[46%]">
                <Link
                  to={postingHref(posting)}
                  data-row-link
                  className="font-serif text-lg leading-tight tracking-tight decoration-border underline-offset-4 outline-none after:absolute after:inset-0 group-hover:underline group-hover:decoration-foreground"
                >
                  {posting.title}
                </Link>
                <PostingMeta posting={posting} />
              </td>
              <td className="px-4 py-4">
                <PostingStatusBadge status={posting.status} />
              </td>
              <td className="px-4 py-4">
                {posting.status === 'draft' ? (
                  <p className="text-sm text-muted-foreground">Not published</p>
                ) : (
                  <ApplicantCounts counts={counts} />
                )}
              </td>
              <td className="relative z-10 px-4 py-4 meta text-muted-foreground">
                <PostingDates posting={posting} stacked />
              </td>
              <td className="py-3 pl-2">
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
  )
}
