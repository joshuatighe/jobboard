import { Earth } from '@carbon/icons-react'

import { Badge } from '@/components/ui/badge'
import { labelFor } from '@/lib/constants'
import type { Job } from '@/lib/types'

/** Experience level, employment type and remote, in the same order everywhere. */
export function JobBadges({
  job,
}: {
  job: Pick<Job, 'experience_level' | 'employment_type' | 'is_remote'>
}) {
  return (
    <>
      <Badge variant="outline">{labelFor.experienceLevel(job.experience_level)}</Badge>
      <Badge variant="outline">{labelFor.employmentType(job.employment_type)}</Badge>
      {job.is_remote && (
        <Badge variant="secondary">
          <Earth /> Remote
        </Badge>
      )}
    </>
  )
}
