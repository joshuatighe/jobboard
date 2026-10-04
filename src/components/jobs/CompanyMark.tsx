import { initials } from '@/lib/format'
import { cn } from '@/lib/utils'

/** A company's initials as a serif monogram on a hairline square. Seed companies have no logos. */
export function CompanyMark({ name, className }: { name: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex size-10 shrink-0 items-center justify-center rounded-md border bg-card font-serif text-base font-medium tracking-tight',
        className,
      )}
    >
      {initials(name)}
    </span>
  )
}
