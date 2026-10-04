import { ChevronRight, MapPin } from 'lucide-react'
import { Link } from 'react-router'

import { ApplicationProgress } from '@/components/applications/ApplicationProgress'
import { ApplicationStatusBadge } from '@/components/applications/ApplicationStatusBadge'
import { JobMark } from '@/components/applications/JobMark'
import { PostedAt } from '@/components/jobs/PostedAt'
import { Badge } from '@/components/ui/badge'
import type { MyApplication } from '@/lib/api/applications'
import { lastActivity } from '@/lib/applications'
import { JOB_STATUSES } from '@/lib/constants'

/** One application in the tracker (R8). The row opens the details; the title opens the job. */
export function ApplicationRow({
  application,
  onOpen,
}: {
  application: MyApplication
  onOpen: () => void
}) {
  const { job } = application
  const updated = lastActivity(application)
  const title = job?.title ?? 'Role no longer listed'

  return (
    <li className="group relative grid grid-cols-[auto_1fr] gap-x-4 py-5 has-[button:focus-visible]:rounded-md has-[button:focus-visible]:ring-2 has-[button:focus-visible]:ring-ring has-[button:focus-visible]:ring-inset sm:gap-x-5">
      <JobMark job={job} />
      <div className="min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-xl leading-tight sm:text-[22px]">
              {job ? (
                // Above the row's stretched button, so it opens the job instead of the details.
                <Link
                  to={`/jobs/${job.id}`}
                  className="relative z-10 rounded-sm decoration-border underline-offset-[5px] outline-none hover:underline hover:decoration-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {title}
                </Link>
              ) : (
                <span className="text-muted-foreground">{title}</span>
              )}
            </h3>
            <p className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-muted-foreground">
              {job ? (
                <>
                  <span className="font-medium text-foreground">{job.company.name}</span>
                  <span aria-hidden>·</span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-3.5" />
                    {job.location}
                  </span>
                  {job.status !== 'open' && (
                    <Badge variant="outline" className="ml-1">
                      Job {JOB_STATUSES[job.status].label.toLowerCase()}
                    </Badge>
                  )}
                </>
              ) : (
                'This posting is no longer available.'
              )}
            </p>
          </div>
          <div className="shrink-0 pt-1">
            <ApplicationStatusBadge status={application.status} />
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
          <ApplicationProgress
            status={application.status}
            events={application.events}
            className="w-full sm:w-40"
          />
          <p className="relative z-10 flex flex-wrap gap-x-3 meta text-muted-foreground">
            <PostedAt date={application.created_at} prefix="Applied" />
            {updated !== application.created_at && <PostedAt date={updated} prefix="Updated" />}
          </p>
          {/* Stretched over the row, so a click anywhere opens the details. */}
          <button
            type="button"
            onClick={onOpen}
            aria-label={`Details for ${title}`}
            className="absolute inset-0 rounded-md text-sm font-medium text-muted-foreground outline-none group-hover:text-foreground sm:static sm:ml-auto sm:inline-flex sm:items-center sm:gap-1 sm:after:absolute sm:after:inset-0"
          >
            <span className="hidden items-center gap-1 sm:inline-flex">
              Details <ChevronRight className="size-3.5" />
            </span>
          </button>
        </div>
      </div>
    </li>
  )
}
