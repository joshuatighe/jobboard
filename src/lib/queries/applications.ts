import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  applyToJob,
  fetchMyApplication,
  fetchMyApplications,
  withdrawApplication,
  type MyApplication,
} from '@/lib/api/applications'

export const applicationKeys = {
  all: ['applications'] as const,
  mine: (jobId: string, seekerId: string) => ['applications', 'mine', jobId, seekerId] as const,
  list: (seekerId: string) => ['applications', 'list', seekerId] as const,
}

export function useMyApplication(jobId: string | undefined, seekerId: string | undefined) {
  return useQuery({
    queryKey: applicationKeys.mine(jobId ?? '', seekerId ?? ''),
    queryFn: () => fetchMyApplication(jobId!, seekerId!),
    enabled: Boolean(jobId && seekerId),
  })
}

/** R8: the seeker's application tracker. */
export function useMyApplications(seekerId: string | undefined) {
  return useQuery({
    queryKey: applicationKeys.list(seekerId ?? ''),
    queryFn: () => fetchMyApplications(seekerId!),
    enabled: Boolean(seekerId),
  })
}

export function useApply() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: applyToJob,
    onSuccess: (application) => {
      queryClient.setQueryData(
        applicationKeys.mine(application.job_id, application.seeker_id),
        application,
      )
      void queryClient.invalidateQueries({ queryKey: applicationKeys.all })
    },
  })
}

/** R8: withdraw, then update the tracker and the job page's "you applied" card in place. */
export function useWithdrawApplication(seekerId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: withdrawApplication,
    onSuccess: (updated) => {
      queryClient.setQueryData<MyApplication[]>(applicationKeys.list(seekerId), (items) =>
        items?.map((item) => (item.id === updated.id ? updated : item)),
      )
      const { job: _job, events: _events, ...row } = updated
      queryClient.setQueryData(applicationKeys.mine(updated.job_id, seekerId), row)
      // The event the database logs for this change isn't visible to the update's own response,
      // so refetch to pick it up for the timeline.
      void queryClient.invalidateQueries({ queryKey: applicationKeys.list(seekerId) })
    },
  })
}
