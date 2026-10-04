import { cn } from '@/lib/utils'

/** R11: the company's hiring at a glance. Unreviewed applicants get the highlighter. */
export function PostingsSummary({
  open,
  applicants,
  awaitingReview,
  interviewing,
}: {
  open: number
  applicants: number
  awaitingReview: number
  interviewing: number
}) {
  const stats: { label: string; value: number; highlight?: boolean }[] = [
    { label: 'Open postings', value: open },
    { label: 'Applicants', value: applicants },
    { label: 'New, not reviewed', value: awaitingReview, highlight: awaitingReview > 0 },
    { label: 'Interviewing', value: interviewing },
  ]

  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-4">
      {stats.map(({ label, value, highlight }) => (
        <div key={label} className="bg-background px-4 py-4 sm:px-5">
          <dt className="meta text-muted-foreground">{label}</dt>
          <dd className="mt-3 font-serif text-4xl leading-none tracking-tight tabular-nums">
            <span className={cn(highlight && 'highlight')}>{value}</span>
          </dd>
        </div>
      ))}
    </dl>
  )
}
