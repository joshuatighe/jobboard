import type { MyApplication } from '@/lib/api/applications'
import { countByTab } from '@/lib/applications'
import { cn } from '@/lib/utils'

/** R8: the tracker at a glance, set as a "by the numbers" strip. An offer gets the highlighter. */
export function ApplicationsSummary({ applications }: { applications: MyApplication[] }) {
  const counts = countByTab(applications)
  const interviewing = applications.filter((a) => a.status === 'interviewing').length

  const stats: { label: string; value: number; highlight?: boolean }[] = [
    { label: 'Applied', value: counts.all },
    { label: 'In progress', value: counts.active },
    { label: 'Interviewing', value: interviewing },
    { label: 'Offers', value: counts.offers, highlight: counts.offers > 0 },
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
