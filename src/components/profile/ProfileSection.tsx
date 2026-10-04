import type { ReactNode } from 'react'

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

/** A titled card on the profile page. `id` is the anchor the profile checklist links to. */
export function ProfileSection({
  id,
  title,
  description,
  action,
  children,
  className,
}: {
  id: string
  title: string
  description?: ReactNode
  action?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <Card id={id} aria-labelledby={`${id}-title`} className={cn('scroll-mt-20 gap-5', className)}>
      <CardHeader>
        <CardTitle id={`${id}-title`} role="heading" aria-level={2}>
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        {action && <CardAction>{action}</CardAction>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
