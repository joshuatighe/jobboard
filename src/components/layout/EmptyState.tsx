import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

/** The empty and error state for lists and pages. Never leave a blank screen. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  tone = 'default',
  className,
}: {
  icon: LucideIcon
  title: string
  description?: ReactNode
  action?: ReactNode
  tone?: 'default' | 'error'
  className?: string
}) {
  return (
    <div
      role={tone === 'error' ? 'alert' : undefined}
      className={cn('flex flex-col items-center justify-center px-6 py-16 text-center', className)}
    >
      <div
        className={cn(
          'mb-5 inline-flex size-11 items-center justify-center rounded-md border',
          tone === 'error' ? 'border-destructive/40 text-destructive' : 'text-muted-foreground',
        )}
      >
        <Icon className="size-5" strokeWidth={1.75} />
      </div>
      <h2 className="text-2xl">{title}</h2>
      {description && <p className="mt-2 max-w-sm text-[15px] text-muted-foreground">{description}</p>}
      {action && <div className="mt-6 flex flex-wrap justify-center gap-2">{action}</div>}
    </div>
  )
}
