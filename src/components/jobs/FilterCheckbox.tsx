import type { ReactNode } from 'react'
import { Check } from 'lucide-react'

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
      className="group flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm text-muted-foreground transition-colors outline-none hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-checked:text-foreground"
    >
      <span
        className={cn(
          'inline-flex size-4 shrink-0 items-center justify-center rounded-[5px] border border-input shadow-xs transition-colors',
          checked && 'border-brand bg-brand text-brand-foreground',
        )}
      >
        {checked && <Check className="size-3" strokeWidth={3} />}
      </span>
      {children}
    </button>
  )
}
