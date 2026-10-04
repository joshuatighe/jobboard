import { CircleDash } from '@carbon/icons-react'
import { toast } from 'sonner'

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
import type { MyApplication } from '@/lib/api/applications'
import { useWithdrawApplication } from '@/lib/queries/applications'

/** R8: confirm before withdrawing. It's final: the same job can't be applied to twice. */
export function WithdrawDialog({
  application,
  seekerId,
  open,
  onOpenChange,
}: {
  application: MyApplication
  seekerId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const withdraw = useWithdrawApplication(seekerId)
  const role = application.job
    ? `${application.job.title} at ${application.job.company.name}`
    : 'this role'

  function confirm() {
    if (withdraw.isPending) return
    withdraw.mutate(application.id, {
      onSuccess: () => {
        onOpenChange(false)
        toast.success('Application withdrawn', { description: role })
      },
      onError: (error) =>
        toast.error("Couldn't withdraw your application", {
          description: error instanceof Error ? error.message : 'Please try again.',
        }),
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={(next) => !withdraw.isPending && onOpenChange(next)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Withdraw this application?</AlertDialogTitle>
          <AlertDialogDescription>
            Your application for <span className="font-medium text-foreground">{role}</span> will be
            marked as withdrawn and the recruiter will see that. You can't apply to this job again.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={withdraw.isPending}>Keep application</AlertDialogCancel>
          <Button variant="destructive" onClick={confirm} disabled={withdraw.isPending}>
            {withdraw.isPending && <CircleDash className="animate-spin" />}
            Withdraw
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
