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

/**
 * R13: rejecting and making an offer are outcomes the candidate sees straight away in their
 * tracker, so they ask first. Both can still be moved back later.
 */
export function ConfirmMoveDialog({
  name,
  target,
  open,
  pending,
  onOpenChange,
  onConfirm,
}: {
  name: string
  target: 'offer' | 'rejected' | undefined
  open: boolean
  pending: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}) {
  const who = <span className="font-medium text-foreground">{name}</span>
  return (
    <AlertDialog open={open} onOpenChange={(next) => !pending && onOpenChange(next)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{target === 'offer' ? 'Mark as offer?' : 'Reject this candidate?'}</AlertDialogTitle>
          <AlertDialogDescription>
            {target === 'offer' ? (
              <>{who} will see “Offer” in their applications right away, so do this once the offer is out.</>
            ) : (
              <>
                {who} will see “Not selected” in their applications right away. You can move them back later if
                you change your mind.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <Button variant={target === 'offer' ? 'default' : 'destructive'} onClick={onConfirm} disabled={pending}>
            {pending && <CircleDash className="animate-spin" />}
            {target === 'offer' ? 'Mark as offer' : 'Reject'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
