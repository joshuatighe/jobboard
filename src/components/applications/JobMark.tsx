import { FileQuestion } from 'lucide-react'

import { CompanyMark } from '@/components/jobs/CompanyMark'
import type { MyApplication } from '@/lib/api/applications'
import { cn } from '@/lib/utils'

/** The company tile for an application, or a neutral one when the job is no longer readable. */
export function JobMark({ job, className }: { job: MyApplication['job']; className?: string }) {
  if (job) return <CompanyMark name={job.company.name} className={className} />
  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex size-10 shrink-0 items-center justify-center rounded-lg border bg-muted text-muted-foreground',
        className,
      )}
    >
      <FileQuestion className="size-4" />
    </span>
  )
}
