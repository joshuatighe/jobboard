import type { LucideIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'

/** Placeholder for screens that are scaffolded but not built yet. */
export function ComingSoon({
  icon: Icon,
  title,
  description,
  requirements,
}: {
  icon: LucideIcon
  title: string
  description: string
  requirements: string[]
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-20 text-center">
      <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-brand-soft text-brand">
        <Icon className="size-6" />
      </div>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      <div className="mt-4 flex gap-1.5">
        {requirements.map((r) => (
          <Badge key={r} variant="outline" className="font-mono">
            {r}
          </Badge>
        ))}
      </div>
    </div>
  )
}
