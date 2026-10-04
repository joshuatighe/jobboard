import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { fetchApplicants, updateApplicationStatus, type Applicant } from '@/lib/api/pipeline'
import { postingKeys } from '@/lib/queries/postings'
import type { ApplicationStatus } from '@/lib/types'

export const pipelineKeys = {
  applicants: (jobId: string) => ['pipeline', jobId] as const,
}

/** R12: a posting's applicants. Only enabled once the posting is known to be the recruiter's. */
export function useApplicants(jobId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: pipelineKeys.applicants(jobId ?? ''),
    queryFn: () => fetchApplicants(jobId!),
    enabled: Boolean(jobId) && enabled,
  })
}

/** R13: change a candidate's status, update the board in place, then refetch for the new timeline event. */
export function useMoveApplicant(jobId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ applicationId, status }: { applicationId: string; status: ApplicationStatus }) =>
      updateApplicationStatus(applicationId, status),
    onSuccess: (updated) => {
      queryClient.setQueryData<Applicant[]>(pipelineKeys.applicants(jobId), (items) =>
        items?.map((item) => (item.id === updated.id ? { ...item, ...updated } : item)),
      )
      // The event the database logs for this change isn't visible to the update's own response
      // (it's inserted by an AFTER trigger), so refetch to pick it up. Dashboard counts change too.
      void queryClient.invalidateQueries({ queryKey: pipelineKeys.applicants(jobId) })
      void queryClient.invalidateQueries({ queryKey: postingKeys.all })
    },
  })
}
