import { ApplyAction } from '@/components/jobs/ApplyAction'
import type { JobWithCompany } from '@/lib/api/jobs'
import { labelFor } from '@/lib/constants'
import { formatPay } from '@/lib/format'

/** The pay, set like a price, and the one call to action that fits whoever is looking (R7). */
export function ApplyCard({ job }: { job: JobWithCompany }) {
  return (
    <div className="rounded-xl border p-5">
      <p className="meta text-muted-foreground">Pay</p>
      <p className="mt-2 font-serif text-3xl leading-none tracking-tight tabular-nums">{formatPay(job)}</p>
      <p className="mt-2 text-sm text-muted-foreground">
        {job.pay_period === 'hour' ? 'Hourly' : 'Base salary'} · {labelFor.employmentType(job.employment_type)}
      </p>
      <div className="mt-5">
        <ApplyAction job={job} />
      </div>
    </div>
  )
}
