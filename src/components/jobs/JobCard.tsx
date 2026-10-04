import { MapPin } from 'lucide-react'
import { Link, useLocation } from 'react-router'

import { CompanyMark } from '@/components/jobs/CompanyMark'
import { JobBadges } from '@/components/jobs/JobBadges'
import { PostedAt } from '@/components/jobs/PostedAt'
import type { JobWithCompany } from '@/lib/api/jobs'
import { formatPay } from '@/lib/format'

const MAX_SKILLS = 3

export function JobCard({ job }: { job: JobWithCompany }) {
  const { search } = useLocation()
  const extraSkills = job.skills.length - MAX_SKILLS

  return (
    <article className="group relative rounded-xl border bg-card p-5 shadow-xs transition-[border-color,box-shadow] duration-150 hover:border-foreground/15 hover:shadow-sm has-[a:focus-visible]:ring-[3px] has-[a:focus-visible]:ring-ring/50">
      <div className="flex gap-4">
        <CompanyMark name={job.company.name} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <div className="min-w-0">
              <h3 className="font-semibold tracking-tight">
                <Link
                  to={`/jobs/${job.id}`}
                  // Lets the detail page link back to these exact results.
                  state={{ search }}
                  className="outline-none after:absolute after:inset-0 after:rounded-xl group-hover:text-brand"
                >
                  {job.title}
                </Link>
              </h3>
              <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-sm text-muted-foreground">
                <span className="font-medium text-foreground/80">{job.company.name}</span>
                <span aria-hidden>·</span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-3.5" />
                  {job.location}
                </span>
              </p>
            </div>
            <p className="shrink-0 text-sm font-medium tabular-nums">{formatPay(job)}</p>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-1.5">
            <JobBadges job={job} />
            {job.skills.slice(0, MAX_SKILLS).map((skill) => (
              <span
                key={skill}
                className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground"
              >
                {skill}
              </span>
            ))}
            {extraSkills > 0 && (
              <span className="text-xs text-muted-foreground">+{extraSkills}</span>
            )}
            {/* Above the stretched link so the date tooltip still opens on hover. */}
            <span className="relative z-10 ml-auto pl-2 text-xs text-muted-foreground">
              <PostedAt date={job.created_at} />
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}
