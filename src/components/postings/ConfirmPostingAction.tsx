import { CircleDash } from '@carbon/icons-react'

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { usePostingAction } from '@/hooks/usePostingAction'
import type { Posting } from '@/lib/api/postings'

export type ConfirmableAction = 'close' | 'delete'

/**
 * Closing hides a posting and stops applications, and deleting a draft can't be undone, so both
 * ask first. Publishing and reopening are easy to reverse and happen straight away.
 */
export function ConfirmPostingAction({
  companyId,
  posting,
  action,
  open,
  onOpenChange,
  onDone,
}: {
  companyId: string
  posting: Pick<Posting, 'id' | 'title'> | undefined
  action: ConfirmableAction | undefined
  /** Separate from `posting` / `action`, which stay set while the dialog animates out. */
  open: boolean
  onOpenChange: (open: boolean) => void
  onDone?: (action: ConfirmableAction) => void
}) {
  const { perform, isPending } = usePostingAction(companyId)

  async function confirm() {
    if (!posting || !action || isPending) return
    if (await perform(posting, action)) {
      onOpenChange(false)
      onDone?.(action)
    }
  }

  const title = <span className="font-medium text-foreground">{posting?.title}</span>

  return (
    <AlertDialog open={open} onOpenChange={(next) => !isPending && onOpenChange(next)}>
      <AlertDialogContent>
        {action === 'delete' ? (
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this draft?</AlertDialogTitle>
            <AlertDialogDescription>
              {title} will be deleted for good. This can't be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
        ) : (
          <AlertDialogHeader>
            <AlertDialogTitle>Close this posting?</AlertDialogTitle>
            <AlertDialogDescription>
              {title} will come out of search and stop taking applications. Everyone who already applied
              stays in your pipeline and still sees it in their tracker. You can reopen it any time.
            </AlertDialogDescription>
          </AlertDialogHeader>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <Button variant="destructive" onClick={() => void confirm()} disabled={isPending}>
            {isPending && <CircleDash className="animate-spin" />}
            {action === 'delete' ? 'Delete draft' : 'Close posting'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
