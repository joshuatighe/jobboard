import { Loader2, SearchX, TriangleAlert } from 'lucide-react'

import { JobCard } from '@/components/jobs/JobCard'
import { JobCardSkeleton } from '@/components/jobs/JobCardSkeleton'
import { EmptyState } from '@/components/layout/EmptyState'
import { Button } from '@/components/ui/button'
import { activeFilterCount, type JobFilters } from '@/lib/job-filters'
import { useJobSearch } from '@/lib/queries/jobs'

const SKELETONS = 5

/** The job search result list with its loading, empty and error states. */
export function JobResults({ filters, onClearAll }: { filters: JobFilters; onClearAll: () => void }) {
  const search = useJobSearch(filters)
  const jobs = search.data?.pages.flatMap((page) => page.jobs) ?? []
  const total = search.data?.pages[0]?.total ?? 0
  const filtered = Boolean(filters.q) || activeFilterCount(filters) > 0

  if (search.isPending) {
    return (
      <div className="mt-6 grid gap-3" aria-busy="true" aria-label="Loading jobs">
        {Array.from({ length: SKELETONS }, (_, i) => (
          <JobCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (search.isError && jobs.length === 0) {
    return (
      <EmptyState
        tone="error"
        icon={TriangleAlert}
        title="We couldn't load jobs"
        description="Check your connection and try again."
        action={<Button onClick={() => void search.refetch()}>Try again</Button>}
        className="mt-6"
      />
    )
  }

  if (total === 0) {
    return (
      <EmptyState
        icon={SearchX}
        title={filtered ? 'No jobs match your search' : 'No open jobs yet'}
        description={
          filtered
            ? 'Try a broader keyword or fewer filters.'
            : 'New roles are posted every week. Check back soon.'
        }
        action={
          filtered && (
            <Button variant="outline" onClick={onClearAll}>
              Clear search and filters
            </Button>
          )
        }
        className="mt-6"
      />
    )
  }

  return (
    <div className="mt-6">
      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground" aria-live="polite">
        <span>
          <span className="font-medium text-foreground tabular-nums">{total}</span>{' '}
          {total === 1 ? 'open role' : 'open roles'}
        </span>
        {search.isFetching && !search.isFetchingNextPage && (
          <Loader2 className="size-3.5 animate-spin" aria-label="Updating results" />
        )}
      </div>
      <div className="grid gap-3">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
      {search.hasNextPage && (
        <div className="mt-6 flex justify-center">
          <Button
            variant="outline"
            onClick={() => void search.fetchNextPage()}
            disabled={search.isFetchingNextPage}
          >
            {search.isFetchingNextPage && <Loader2 className="animate-spin" />}
            Show more roles
          </Button>
        </div>
      )}
    </div>
  )
}
