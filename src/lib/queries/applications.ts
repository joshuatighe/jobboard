import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { applyToJob, fetchMyApplication } from '@/lib/api/applications'

export const applicationKeys = {
  all: ['applications'] as const,
  mine: (jobId: string, seekerId: string) => ['applications', 'mine', jobId, seekerId] as const,
}

export function useMyApplication(jobId: string | undefined, seekerId: string | undefined) {
  return useQuery({
    queryKey: applicationKeys.mine(jobId ?? '', seekerId ?? ''),
    queryFn: () => fetchMyApplication(jobId!, seekerId!),
    enabled: Boolean(jobId && seekerId),
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
