import { BriefcaseBusiness, CalendarCheck, Inbox, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

/** R11: the company's hiring at a glance. */
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
  const stats: { label: string; value: number; icon: LucideIcon; highlight?: boolean }[] = [
    { label: 'Open postings', value: open, icon: BriefcaseBusiness },
    { label: 'Applicants', value: applicants, icon: Users },
    { label: 'New, not reviewed', value: awaitingReview, icon: Inbox, highlight: awaitingReview > 0 },
    { label: 'Interviewing', value: interviewing, icon: CalendarCheck },
  ]

  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map(({ label, value, icon: Icon, highlight }) => (
        <div key={label} className="rounded-xl border bg-card px-4 py-3 shadow-xs">
          <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Icon className={cn('size-3.5', highlight && 'text-brand')} />
            {label}
          </dt>
          <dd
            className={cn(
              'mt-1 text-2xl font-semibold tracking-tight tabular-nums',
              highlight && 'text-brand',
            )}
          >
            {value}
          </dd>
        </div>
      ))}
    </dl>
  )
}
