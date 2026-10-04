import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  createPosting,
  deletePosting,
  fetchCompanyPostings,
  fetchMyCompany,
  fetchPosting,
  updatePosting,
  type Posting,
} from '@/lib/api/postings'
import type { PostingFields } from '@/lib/postings'
import { jobKeys } from '@/lib/queries/jobs'
import type { JobStatus } from '@/lib/types'

export const postingKeys = {
  company: (userId: string) => ['my-company', userId] as const,
  all: ['postings'] as const,
  list: (companyId: string) => ['postings', 'list', companyId] as const,
  detail: (companyId: string, jobId: string) => ['postings', 'detail', companyId, jobId] as const,
}

export function useMyCompany(userId: string | undefined) {
  return useQuery({
    queryKey: postingKeys.company(userId ?? ''),
    queryFn: () => fetchMyCompany(userId!),
    enabled: Boolean(userId),
    staleTime: Infinity,
  })
}

/** R11: every posting at the company, with applicant statuses. */
export function useCompanyPostings(companyId: string | undefined) {
  return useQuery({
    queryKey: postingKeys.list(companyId ?? ''),
    queryFn: () => fetchCompanyPostings(companyId!),
    enabled: Boolean(companyId),
  })
}

/** One posting, starting from the dashboard's copy when there is one. */
export function usePosting(companyId: string | undefined, jobId: string | undefined) {
  const queryClient = useQueryClient()
  return useQuery({
    queryKey: postingKeys.detail(companyId ?? '', jobId ?? ''),
    queryFn: () => fetchPosting(companyId!, jobId!),
    enabled: Boolean(companyId && jobId),
    initialData: () =>
      queryClient
        .getQueryData<Posting[]>(postingKeys.list(companyId ?? ''))
        ?.find((posting) => posting.id === jobId),
    initialDataUpdatedAt: () => queryClient.getQueryState(postingKeys.list(companyId ?? ''))?.dataUpdatedAt,
  })
}

/** Put the saved posting everywhere it's cached, and let the public job views refetch. */
function useStorePosting(companyId: string) {
  const queryClient = useQueryClient()
  return (posting: Posting) => {
    queryClient.setQueryData<Posting[]>(postingKeys.list(companyId), (items) =>
      items && (items.some((p) => p.id === posting.id)
        ? items.map((p) => (p.id === posting.id ? posting : p))
        : [posting, ...items]),
    )
    queryClient.setQueryData(postingKeys.detail(companyId, posting.id), posting)
    void queryClient.invalidateQueries({ queryKey: jobKeys.all })
  }
}

/** R10 */
export function useCreatePosting(companyId: string) {
  const store = useStorePosting(companyId)
  return useMutation({
    mutationFn: ({ fields, status }: { fields: PostingFields; status: 'draft' | 'open' }) =>
      createPosting(fields, status),
    onSuccess: store,
  })
}

/** R10/R11: edit fields, change status, or both. */
export function useUpdatePosting(companyId: string) {
  const store = useStorePosting(companyId)
  return useMutation({
    mutationFn: ({ jobId, patch }: { jobId: string; patch: Partial<PostingFields> & { status?: JobStatus } }) =>
      updatePosting(jobId, patch),
    onSuccess: store,
  })
}

export function useDeletePosting(companyId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deletePosting,
    onSuccess: (_, jobId) => {
      queryClient.setQueryData<Posting[]>(postingKeys.list(companyId), (items) =>
        items?.filter((p) => p.id !== jobId),
      )
      queryClient.removeQueries({ queryKey: postingKeys.detail(companyId, jobId) })
    },
  })
}
