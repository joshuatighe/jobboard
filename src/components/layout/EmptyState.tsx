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
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-16 text-center',
        className,
      )}
    >
      <div
        className={cn(
          'mb-4 inline-flex size-11 items-center justify-center rounded-xl',
          tone === 'error' ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground',
        )}
      >
        <Icon className="size-5" />
      </div>
      <h2 className="font-semibold">{title}</h2>
      {description && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-5 flex gap-2">{action}</div>}
    </div>
  )
}
