import { ApplyAction } from '@/components/jobs/ApplyAction'
import type { JobWithCompany } from '@/lib/api/jobs'
import { labelFor } from '@/lib/constants'
import { formatPay } from '@/lib/format'

/** The pay summary and the one call to action that fits whoever is looking (R7). */
export function ApplyCard({ job }: { job: JobWithCompany }) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-xs">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Pay</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">{formatPay(job)}</p>
      <p className="mt-0.5 text-sm text-muted-foreground">
        {job.pay_period === 'hour' ? 'Hourly' : 'Base salary'} ·{' '}
        {labelFor.employmentType(job.employment_type)}
      </p>
      <div className="mt-5">
        <ApplyAction job={job} />
      </div>
    </div>
  )
}
