import {
  ExternalLink,
  MoreHorizontal,
  RotateCcw,
  Rocket,
  SquarePen,
  Trash2,
  Undo2,
  Users,
  XCircle,
  type LucideIcon,
} from 'lucide-react'
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

const ACTIONS: Record<PostingAction, { label: string; icon: LucideIcon; destructive?: boolean }> = {
  publish: { label: 'Publish', icon: Rocket },
  reopen: { label: 'Reopen', icon: RotateCcw },
  unpublish: { label: 'Move back to drafts', icon: Undo2 },
  close: { label: 'Close posting…', icon: XCircle, destructive: true },
  delete: { label: 'Delete draft…', icon: Trash2, destructive: true },
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
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        {posting.status !== 'draft' && (
          <DropdownMenuItem asChild>
            <Link to={`/postings/${posting.id}`}>
              <Users /> View applicants
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link to={`/postings/${posting.id}/edit`}>
            <SquarePen /> Edit posting
          </Link>
        </DropdownMenuItem>
        {posting.status === 'open' && (
          <DropdownMenuItem asChild>
            <Link to={`/jobs/${posting.id}`}>
              <ExternalLink /> View live posting
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
