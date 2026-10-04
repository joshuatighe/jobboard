import { useState } from 'react'
import { ArrowRight, PartyPopper, Recommend, Search, SettingsAdjust, Task, WarningAlt } from '@carbon/icons-react'
import { Link } from 'react-router'

import { JobCard } from '@/components/jobs/JobCard'
import { JobCardSkeleton } from '@/components/jobs/JobCardSkeleton'
import { EmptyState } from '@/components/layout/EmptyState'
import { PageHeader } from '@/components/layout/PageHeader'
import { SetupNotice } from '@/components/layout/SetupNotice'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { buildFeed, listSignals, matchSignals, missingSignals } from '@/lib/feed'
import { useMyApplications } from '@/lib/queries/applications'
import { useOpenJobs } from '@/lib/queries/jobs'
import { useSeekerProfile } from '@/lib/queries/seekers'
import { isSupabaseConfigured } from '@/lib/supabase'

const PAGE_SIZE = 10
const PREFERENCES_HREF = '/profile#preferences'

/** R6: open jobs ranked by how well they match the seeker's profile and preferences. */
export function ForYouPage() {
  const { profile } = useAuth()
  const seeker = useSeekerProfile(profile?.id)
  const jobs = useOpenJobs()
  const applications = useMyApplications(profile?.id)
  const [shown, setShown] = useState(PAGE_SIZE)

  const header = (
    <PageHeader
      title="For you"
      description="Every open role, scored against your profile and preferences. The reasons are printed under each one."
      actions={
        <Button asChild variant="outline">
          <Link to={PREFERENCES_HREF}>
            <SettingsAdjust /> Preferences
          </Link>
        </Button>
      }
    />
  )

  if (!isSupabaseConfigured) return <SetupNotice />

  const queries = [seeker, jobs, applications]
  if (!profile || queries.some((q) => q.isPending)) {
    return (
      <>
        {header}
        <div className="divide-y border-b" aria-busy="true" aria-label="Loading your matches">
          {[0, 1, 2, 3].map((i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      </>
    )
  }

  if (queries.some((q) => q.isError) || !seeker.data) {
    return (
      <>
        {header}
        <EmptyState
          tone="error"
          icon={WarningAlt}
          title="We couldn't load your matches"
          description="Check your connection and try again."
          action={
            <Button onClick={() => queries.forEach((q) => q.isError && void q.refetch())}>
              Try again
            </Button>
          }
        />
      </>
    )
  }

  // Ranking on nothing but the default "remote OK" would be noise, so ask for preferences instead.
  if (matchSignals(seeker.data).length === 0) {
    return (
      <>
        {header}
        <EmptyState
          icon={Recommend}
          title="Tell us what you're looking for"
          description="Add your experience level, locations, pay, job types or skills and we'll rank every open role by how well it fits."
          action={
            <>
              <Button asChild>
                <Link to={PREFERENCES_HREF}>
                  Set preferences <ArrowRight />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/jobs">
                  <Search /> Browse all jobs
                </Link>
              </Button>
            </>
          }
        />
      </>
    )
  }

  const appliedIds = new Set((applications.data ?? []).map((a) => a.job_id))
  const { matches, appliedCount } = buildFeed(jobs.data ?? [], seeker.data, appliedIds)
  const missing = missingSignals(seeker.data)
  // Skills are edited in the About section; everything else is under Preferences.
  const nudgeHref = missing.every((s) => s === 'skills') ? '/profile#about' : PREFERENCES_HREF

  return (
    <>
      {header}
      <div className="space-y-4">
        {missing.length > 0 && (
          <div className="flex flex-col gap-2 border bg-muted/40 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-muted-foreground">
              <Recommend className="mr-1.5 inline size-4 -translate-y-px text-foreground" />
              Add your {listSignals(missing)} to sharpen these matches.
            </p>
            <Link
              to={nudgeHref}
              className="inline-flex shrink-0 items-center gap-1 font-medium underline decoration-border underline-offset-4 outline-none hover:decoration-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Update profile <ArrowRight className="size-4" />
            </Link>
          </div>
        )}

        {matches.length === 0 ? (
          <EmptyState
            icon={PartyPopper}
            title={appliedCount > 0 ? "You're all caught up" : 'No open roles right now'}
            description={
              appliedCount > 0
                ? "You've applied to every open role. New postings will show up here."
                : 'Check back soon. New roles are posted every week.'
            }
            action={
              appliedCount > 0 && (
                <Button asChild variant="outline">
                  <Link to="/applications">
                    <Task /> Track applications
                  </Link>
                </Button>
              )
            }
          />
        ) : (
          <>
            <ul className="divide-y border-b">
              {matches.slice(0, shown).map(({ match, ...job }) => (
                <li key={job.id}>
                  <JobCard job={job} match={match} />
                </li>
              ))}
            </ul>
            {shown < matches.length && (
              <div className="flex justify-center pt-2">
                <Button variant="outline" onClick={() => setShown((n) => n + PAGE_SIZE)}>
                  Show more matches
                </Button>
              </div>
            )}
          </>
        )}

        {appliedCount > 0 && matches.length > 0 && (
          <p className="pt-2 text-center text-sm text-muted-foreground">
            {appliedCount} {appliedCount === 1 ? 'role' : 'roles'} you've applied to{' '}
            {appliedCount === 1 ? 'is' : 'are'} hidden.{' '}
            <Link to="/applications" className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground">
              Track your applications
            </Link>
          </p>
        )}
      </div>
    </>
  )
}
