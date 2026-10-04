import { Link } from 'react-router'

import { cn } from '@/lib/utils'

/** The mark on its own: a serif J on a highlighter square. Used where the wordmark won't fit. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex size-7 items-center justify-center rounded-sm bg-highlight font-serif text-[19px] leading-none font-semibold text-highlight-foreground',
        className,
      )}
      aria-hidden
    >
      J
    </span>
  )
}

/** The wordmark: "Job" under a highlighter stroke, "Board" plain. */
export function Logo({ to = '/', className }: { to?: string; className?: string }) {
  return (
    <Link
      to={to}
      aria-label="JobBoard home"
      className={cn(
        'inline-flex items-baseline rounded-sm font-serif text-[22px] leading-none font-medium tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        className,
      )}
    >
      <span className="highlight">Job</span>
      <span>Board</span>
    </Link>
  )
}
