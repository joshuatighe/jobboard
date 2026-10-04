import type { ReactNode } from 'react'
import { Checkmark } from '@carbon/icons-react'

import { cn } from '@/lib/utils'

/** A full-width, keyboard-accessible checkbox row for the filter panel. */
export function FilterCheckbox({
  checked,
  onCheckedChange,
  children,
}: {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className="group flex w-full items-center gap-2.5 px-2 py-1.5 text-left text-sm text-muted-foreground transition-colors outline-none hover:bg-accent hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-checked:text-foreground"
    >
      <span
        className={cn(
          'inline-flex size-4 shrink-0 items-center justify-center border border-input bg-background transition-colors',
          checked && 'border-foreground bg-foreground text-background',
        )}
      >
        {checked && <Checkmark className="size-3" />}
      </span>
      {children}
    </button>
  )
}
