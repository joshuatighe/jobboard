import { toast } from 'sonner'

import type { Applicant } from '@/lib/api/pipeline'
import { APPLICATION_STATUSES } from '@/lib/constants'
import { candidateName } from '@/lib/pipeline'
import { useMoveApplicant } from '@/lib/queries/pipeline'
import type { ApplicationStatus } from '@/lib/types'

/** R13: move a candidate, with a toast either way. The candidate sees the change in their tracker (R8). */
export function useMoveCandidate(jobId: string) {
  const move = useMoveApplicant(jobId)

  async function perform(applicant: Applicant, status: ApplicationStatus): Promise<boolean> {
    const name = candidateName(applicant)
    try {
      await move.mutateAsync({ applicationId: applicant.id, status })
      toast.success(
        status === 'rejected' ? `${name} marked as not selected` : `${name} moved to ${APPLICATION_STATUSES[status].label}`,
        { description: 'They see the update in their applications.' },
      )
      return true
    } catch (error) {
      toast.error(`Couldn't update ${name}`, {
        description: error instanceof Error ? error.message : 'Please try again.',
      })
      return false
    }
  }

  return { perform, isPending: move.isPending, pendingId: move.isPending ? move.variables?.applicationId : undefined }
}
