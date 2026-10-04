import { MapPin } from 'lucide-react'

import { ApplicationStatusBadge } from '@/components/applications/ApplicationStatusBadge'
import { PostedAt } from '@/components/jobs/PostedAt'
import { CandidateAvatar } from '@/components/pipeline/CandidateAvatar'
import { MoveMenu } from '@/components/pipeline/MoveMenu'
import type { Applicant } from '@/lib/api/pipeline'
import { candidateName } from '@/lib/pipeline'
import type { ApplicationStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

/** R12: one candidate on the board. The whole card opens their details. */
export function CandidateCard({
  applicant,
  onOpen,
  onMove,
  pending,
}: {
  applicant: Applicant
  onOpen: () => void
  onMove: (target: ApplicationStatus) => void
  pending: boolean
}) {
  const name = candidateName(applicant)
  const seeker = applicant.candidate?.seeker

  return (
    <article
      aria-busy={pending}
      className={cn(
        'relative rounded-lg border bg-card p-3 shadow-xs transition-[border-color,box-shadow,opacity] duration-150 hover:border-foreground/15 hover:shadow-sm has-[button[data-card-open]:focus-visible]:ring-[3px] has-[button[data-card-open]:focus-visible]:ring-ring/50',
        pending && 'opacity-60',
      )}
    >
      <div className="flex items-start gap-2.5">
        <CandidateAvatar name={name} className="size-8" />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold">
            <button
              type="button"
              data-card-open
              onClick={onOpen}
              className="cursor-pointer text-left outline-none after:absolute after:inset-0 after:rounded-lg hover:text-brand"
            >
              {name}
            </button>
          </h3>
          {seeker?.headline && <p className="line-clamp-2 text-xs text-muted-foreground">{seeker.headline}</p>}
        </div>
      </div>
      <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
        {seeker?.location && (
          <span className="inline-flex min-w-0 items-center gap-1">
            <MapPin className="size-3 shrink-0" />
            <span className="truncate">{seeker.location}</span>
          </span>
        )}
        <span className="relative z-10">
          <PostedAt date={applicant.created_at} prefix="Applied" />
        </span>
      </div>
      <div className="mt-2 flex min-h-8 items-center justify-between gap-2">
        <ApplicationStatusBadge status={applicant.status} />
        <MoveMenu status={applicant.status} name={name} onMove={onMove} disabled={pending} compact />
      </div>
    </article>
  )
}
