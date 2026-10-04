import { PostedAt } from '@/components/jobs/PostedAt'
import type { Posting } from '@/lib/api/postings'
import { cn } from '@/lib/utils'

/** "Posted 3d ago" (or "Created" for a draft) and "Updated 1h ago", with exact dates in tooltips. */
export function PostingDates({
  posting,
  stacked,
  className,
}: {
  posting: Pick<Posting, 'status' | 'created_at' | 'updated_at'>
  stacked?: boolean
  className?: string
}) {
  // Any save bumps `updated_at`, so only call it an update when it's meaningfully later.
  const edited = new Date(posting.updated_at).getTime() - new Date(posting.created_at).getTime() > 60_000
  return (
    <span className={cn(stacked ? 'flex flex-col items-start gap-0.5' : 'inline-flex flex-wrap gap-x-1.5', className)}>
      <PostedAt date={posting.created_at} prefix={posting.status === 'draft' ? 'Created' : 'Posted'} />
      {edited && (
        <>
          {!stacked && <span aria-hidden>·</span>}
          <PostedAt date={posting.updated_at} prefix="Updated" />
        </>
      )}
    </span>
  )
}
