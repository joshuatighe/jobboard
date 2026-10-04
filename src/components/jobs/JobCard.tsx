import { MapPin } from 'lucide-react'
import { Link, useLocation } from 'react-router'

import { CompanyMark } from '@/components/jobs/CompanyMark'
import { JobBadges } from '@/components/jobs/JobBadges'
import { MatchReasons } from '@/components/jobs/MatchReasons'
import { PostedAt } from '@/components/jobs/PostedAt'
import type { JobWithCompany } from '@/lib/api/jobs'
import { formatPay } from '@/lib/format'
import type { MatchResult } from '@/lib/matching'

const MAX_SKILLS = 3

/**
 * A job in a list, set as one listing in a column: the parent list draws the rules between rows
 * (`divide-y`). With `match` (R6), it also shows the score and why the job matches.
 */
export function JobCard({ job, match }: { job: JobWithCompany; match?: MatchResult }) {
  const { search } = useLocation()
  const extraSkills = job.skills.length - MAX_SKILLS

  return (
    <article className="group relative grid grid-cols-[auto_1fr] gap-x-4 py-5 has-[a:focus-visible]:rounded-md has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-ring has-[a:focus-visible]:ring-inset sm:gap-x-5">
      <CompanyMark name={job.company.name} />
      <div className="min-w-0">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
          <h3 className="text-xl leading-tight sm:text-[22px]">
            <Link
              to={`/jobs/${job.id}`}
              // Lets the detail page link back to these exact results.
              state={{ search }}
              className="decoration-border underline-offset-[5px] outline-none after:absolute after:inset-0 group-hover:underline group-hover:decoration-foreground"
            >
              {job.title}
            </Link>
          </h3>
          <p className="shrink-0 text-[15px] font-medium tabular-nums">{formatPay(job)}</p>
        </div>
        <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{job.company.name}</span>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3.5" />
            {job.location}
          </span>
          <span aria-hidden>·</span>
          {/* Above the stretched link so the date tooltip still opens on hover. */}
          <span className="relative z-10">
            <PostedAt date={job.created_at} />
          </span>
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <span className="flex flex-wrap gap-1.5">
            <JobBadges job={job} />
          </span>
          {job.skills.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {job.skills.slice(0, MAX_SKILLS).join(' · ')}
              {extraSkills > 0 && <span> +{extraSkills}</span>}
            </p>
          )}
        </div>

        {match && (
          <div className="mt-4">
            <MatchReasons match={match} />
          </div>
        )}
      </div>
    </article>
  )
}
