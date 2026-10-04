import {
  type CarbonIconType,
  CloseOutline,
  Edit,
  Launch,
  OverflowMenuHorizontal,
  Reset,
  Rocket,
  TrashCan,
  Undo,
  UserMultiple,
} from '@carbon/icons-react'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Posting } from '@/lib/api/postings'
import { postingActions, type PostingAction } from '@/lib/postings'

const ACTIONS: Record<PostingAction, { label: string; icon: CarbonIconType; destructive?: boolean }> = {
  publish: { label: 'Publish', icon: Rocket },
  reopen: { label: 'Reopen', icon: Reset },
  unpublish: { label: 'Move back to drafts', icon: Undo },
  close: { label: 'Close posting…', icon: CloseOutline, destructive: true },
  delete: { label: 'Delete draft…', icon: TrashCan, destructive: true },
}

/** R11: everything you can do with one posting, from the dashboard. */
export function PostingActionsMenu({
  posting,
  applicantCount,
  onAction,
  disabled,
}: {
  posting: Posting
  applicantCount: number
  onAction: (action: PostingAction) => void
  disabled?: boolean
}) {
  const actions = postingActions(posting.status, applicantCount)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          disabled={disabled}
          aria-label={`Actions for ${posting.title}`}
          className="relative z-10"
        >
          <OverflowMenuHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        {posting.status !== 'draft' && (
          <DropdownMenuItem asChild>
            <Link to={`/postings/${posting.id}`}>
              <UserMultiple /> View applicants
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link to={`/postings/${posting.id}/edit`}>
            <Edit /> Edit posting
          </Link>
        </DropdownMenuItem>
        {posting.status === 'open' && (
          <DropdownMenuItem asChild>
            <Link to={`/jobs/${posting.id}`}>
              <Launch /> View live posting
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        {actions.map((action) => {
          const { label, icon: Icon, destructive } = ACTIONS[action]
          return (
            <DropdownMenuItem
              key={action}
              variant={destructive ? 'destructive' : 'default'}
              onSelect={() => onAction(action)}
            >
              <Icon /> {label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
