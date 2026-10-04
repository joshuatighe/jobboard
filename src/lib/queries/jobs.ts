import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query'

import { fetchJob, JOBS_PAGE_SIZE, searchJobs } from '@/lib/api/jobs'
import type { JobFilters } from '@/lib/job-filters'

export const jobKeys = {
  all: ['jobs'] as const,
  search: (filters: JobFilters) => ['jobs', 'search', filters] as const,
  detail: (jobId: string) => ['jobs', 'detail', jobId] as const,
}

export function useJobSearch(filters: JobFilters) {
  return useInfiniteQuery({
    queryKey: jobKeys.search(filters),
    queryFn: ({ pageParam }) => searchJobs(filters, pageParam),
    initialPageParam: 0,
    getNextPageParam: (last, pages) =>
      pages.length * JOBS_PAGE_SIZE < last.total ? pages.length : undefined,
    // Keep showing the previous results while a new filter combination loads.
    placeholderData: keepPreviousData,
  })
}

export function useJob(jobId: string | undefined) {
  return useQuery({
    queryKey: jobKeys.detail(jobId ?? ''),
    queryFn: () => fetchJob(jobId!),
    enabled: Boolean(jobId),
  })
}
