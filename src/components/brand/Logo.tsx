import { Link } from 'react-router'

import { cn } from '@/lib/utils'

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'relative inline-flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-indigo-500 text-brand-foreground shadow-sm shadow-brand/30',
        className,
      )}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2.5}>
        <path d="M7 12.5 10.5 16 17 8.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

export function Logo({ to = '/', className }: { to?: string; className?: string }) {
  return (
    <Link
      to={to}
      className={cn('inline-flex items-center gap-2 font-semibold tracking-tight', className)}
    >
      <LogoMark />
      <span className="text-[15px]">JobBoard</span>
    </Link>
  )
}
