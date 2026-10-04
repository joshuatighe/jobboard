import { DocumentUnknown } from '@carbon/icons-react'

import { CompanyMark } from '@/components/jobs/CompanyMark'
import type { MyApplication } from '@/lib/api/applications'
import { cn } from '@/lib/utils'

/** The company monogram for an application, or a neutral one when the job is no longer readable. */
export function JobMark({ job, className }: { job: MyApplication['job']; className?: string }) {
  if (job) return <CompanyMark name={job.company.name} className={className} />
  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex size-10 shrink-0 items-center justify-center border border-dashed text-muted-foreground',
        className,
      )}
    >
      <DocumentUnknown className="size-4" />
    </span>
  )
}
