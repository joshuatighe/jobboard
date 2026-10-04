import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'

/** Save / discard row at the bottom of a profile form. Only active once something changed. */
export function FormFooter({
  isDirty,
  isSubmitting,
  onDiscard,
}: {
  isDirty: boolean
  isSubmitting: boolean
  onDiscard: () => void
}) {
  return (
    <div className="flex items-center justify-end gap-2 border-t pt-5">
      {isDirty && !isSubmitting && (
        <p className="mr-auto text-xs text-muted-foreground" aria-live="polite">
          Unsaved changes
        </p>
      )}
      {isDirty && (
        <Button type="button" variant="ghost" onClick={onDiscard} disabled={isSubmitting}>
          Discard
        </Button>
      )}
      <Button type="submit" disabled={!isDirty || isSubmitting}>
        {isSubmitting && <Loader2 className="animate-spin" />}
        Save changes
      </Button>
    </div>
  )
}
