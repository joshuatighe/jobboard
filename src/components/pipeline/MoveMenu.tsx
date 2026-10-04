import { ArrowLeft, ArrowRight, ChevronDown, CloseOutline, OverflowMenuHorizontal } from '@carbon/icons-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { APPLICATION_STATUSES, PIPELINE } from '@/lib/constants'
import { recruiterTargets } from '@/lib/pipeline'
import type { ApplicationStatus } from '@/lib/types'

/** R13: every status a recruiter can move this candidate to, forward or back. */
export function MoveMenu({
  status,
  name,
  onMove,
  disabled,
  compact,
}: {
  status: ApplicationStatus
  name: string
  onMove: (target: ApplicationStatus) => void
  disabled?: boolean
  /** An icon button for cards; otherwise a labelled "Move to" button. */
  compact?: boolean
}) {
  const targets = recruiterTargets(status)
  if (targets.length === 0) return null
  const current = PIPELINE.indexOf(status)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {compact ? (
          <Button
            variant="ghost"
            size="icon-sm"
            disabled={disabled}
            aria-label={`Move ${name}`}
            className="relative z-10"
          >
            <OverflowMenuHorizontal />
          </Button>
        ) : (
          <Button variant="outline" disabled={disabled}>
            Move to <ChevronDown />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Move to</DropdownMenuLabel>
        {targets
          .filter((target) => target !== 'rejected')
          .map((target) => {
            const back = current >= 0 && PIPELINE.indexOf(target) < current
            return (
              <DropdownMenuItem key={target} onSelect={() => onMove(target)}>
                {back ? <ArrowLeft /> : <ArrowRight />}
                {APPLICATION_STATUSES[target].label}
              </DropdownMenuItem>
            )
          })}
        {targets.includes('rejected') && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onSelect={() => onMove('rejected')}>
              <CloseOutline /> Reject…
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
