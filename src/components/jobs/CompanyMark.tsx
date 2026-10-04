import { initials } from '@/lib/format'
import { cn } from '@/lib/utils'

/** A company's initials in a soft brand tile. Seed companies have no logos. */
export function CompanyMark({ name, className }: { name: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex size-10 shrink-0 items-center justify-center rounded-lg border bg-brand-soft text-sm font-semibold text-brand',
        className,
      )}
    >
      {initials(name)}
    </span>
  )
}
