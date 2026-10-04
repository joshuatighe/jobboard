import { ArrowLeft, Building2, ExternalLink, MapPin, SearchX, TriangleAlert } from 'lucide-react'
import { Link, useLocation, useParams } from 'react-router'

import { ApplyCard } from '@/components/jobs/ApplyCard'
import { CompanyMark } from '@/components/jobs/CompanyMark'
import { JobBadges } from '@/components/jobs/JobBadges'
import { JobDescription } from '@/components/jobs/JobDescription'
import { JobDetailSkeleton } from '@/components/jobs/JobDetailSkeleton'
import { PostedAt } from '@/components/jobs/PostedAt'
import { EmptyState } from '@/components/layout/EmptyState'
import { SetupNotice } from '@/components/layout/SetupNotice'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { JOB_STATUSES } from '@/lib/constants'
import { displayUrl } from '@/lib/format'
import { useJob } from '@/lib/queries/jobs'
import { isSupabaseConfigured } from '@/lib/supabase'

/** R7: the full posting, and applying to it. */
export function JobDetailPage() {
  const { jobId } = useParams()
  const location = useLocation()
  const job = useJob(jobId)
  // Set by JobCard, so "back" returns to the same search and filters.
  const backSearch = (location.state as { search?: string } | null)?.search ?? ''

  if (!isSupabaseConfigured) return <SetupNotice />
  if (job.isPending) return <JobDetailSkeleton />

  if (job.isError) {
    return (
      <EmptyState
        tone="error"
        icon={TriangleAlert}
        title="We couldn't load this job"
        description="Check your connection and try again."
        action={<Button onClick={() => void job.refetch()}>Try again</Button>}
      />
    )
  }

  if (!job.data) {
    return (
      <EmptyState
        icon={SearchX}
        title="This job isn't available"
        description="It may have been filled or taken down. There are plenty more where it came from."
        action={
          <Button asChild variant="outline">
            <Link to="/jobs">Browse open roles</Link>
          </Button>
        }
      />
    )
  }

  const { company, ...posting } = job.data

  return (
    <article>
      <Link
        to={`/jobs${backSearch}`}
        className="inline-flex items-center gap-1.5 rounded-md text-sm text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <ArrowLeft className="size-4" /> {backSearch ? 'Back to results' : 'All jobs'}
      </Link>

      <header className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start">
        <CompanyMark name={company.name} className="size-14 rounded-xl text-base" />
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold sm:text-3xl">{posting.title}</h1>
            {posting.status !== 'open' && (
              <Badge variant={JOB_STATUSES[posting.status].tone}>
                {JOB_STATUSES[posting.status].label}
              </Badge>
            )}
          </div>
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-muted-foreground">
            <span className="font-medium text-foreground">{company.name}</span>
            <span aria-hidden>·</span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-4" /> {posting.location}
            </span>
            <span aria-hidden>·</span>
            <span className="text-sm">
              <PostedAt date={posting.created_at} />
            </span>
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            <JobBadges job={posting} />
          </div>
        </div>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_20rem]">
        <aside className="space-y-4 lg:col-start-2 lg:row-start-1">
          <div className="space-y-4 lg:sticky lg:top-24">
            <ApplyCard job={job.data} />
            <section className="rounded-xl border bg-card p-5 shadow-xs">
              <h2 className="flex items-center gap-2 text-sm font-semibold">
                <Building2 className="size-4 text-muted-foreground" /> About {company.name}
              </h2>
              {company.description && (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {company.description}
                </p>
              )}
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-medium hover:underline"
                >
                  {displayUrl(company.website)} <ExternalLink className="size-3.5" />
                </a>
              )}
            </section>
          </div>
        </aside>

        <div className="min-w-0 lg:col-start-1 lg:row-start-1">
          <JobDescription text={posting.description} />
          {posting.skills.length > 0 && (
            <section className="mt-10 border-t pt-6">
              <h2 className="text-sm font-semibold">Skills</h2>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {posting.skills.map((skill) => (
                  <li key={skill} className="rounded-full border px-2.5 py-0.5 text-sm text-muted-foreground">
                    {skill}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </article>
  )
}
