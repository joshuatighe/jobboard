import { CalendarCheck, Inbox, PartyPopper, Send } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import type { MyApplication } from '@/lib/api/applications'
import { countByTab } from '@/lib/applications'
import { cn } from '@/lib/utils'

/** R8: the tracker at a glance. */
export function ApplicationsSummary({ applications }: { applications: MyApplication[] }) {
  const counts = countByTab(applications)
  const interviewing = applications.filter((a) => a.status === 'interviewing').length

  const stats: { label: string; value: number; icon: LucideIcon; highlight?: boolean }[] = [
    { label: 'Applied', value: counts.all, icon: Send },
    { label: 'In progress', value: counts.active, icon: Inbox },
    { label: 'Interviewing', value: interviewing, icon: CalendarCheck },
    { label: 'Offers', value: counts.offers, icon: PartyPopper, highlight: counts.offers > 0 },
  ]

  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map(({ label, value, icon: Icon, highlight }) => (
        <div key={label} className="rounded-xl border bg-card px-4 py-3 shadow-xs">
          <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Icon className={cn('size-3.5', highlight && 'text-success')} />
            {label}
          </dt>
          <dd
            className={cn(
              'mt-1 text-2xl font-semibold tracking-tight tabular-nums',
              highlight && 'text-success',
            )}
          >
            {value}
          </dd>
        </div>
      ))}
    </dl>
  )
}
