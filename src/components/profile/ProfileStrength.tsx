import { ArrowRight, Checkmark } from '@carbon/icons-react'

import { Card } from '@/components/ui/card'
import type { ProfileStep } from '@/lib/profile'
import { cn } from '@/lib/utils'

/** How complete the profile is, with links to the sections still missing. */
export function ProfileStrength({ steps }: { steps: ProfileStep[] }) {
  const done = steps.filter((s) => s.done).length
  const percent = Math.round((done / steps.length) * 100)
  const complete = done === steps.length

  return (
    <Card className="gap-4 p-5">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-xl">Profile strength</h2>
        <span className="font-serif text-xl tabular-nums">{percent}%</span>
      </div>
      <div
        role="progressbar"
        aria-label="Profile strength"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-1.5 overflow-hidden bg-border"
      >
        <div
          className={cn('h-full transition-[width] duration-200', complete ? 'bg-success' : 'bg-foreground')}
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        {complete
          ? 'Looking sharp. Your For-you feed has everything it needs.'
          : 'A complete profile gets better matches and stronger applications.'}
      </p>
      <ul className="grid gap-0.5">
        {steps.map((step) => (
          <li key={step.key}>
            {step.done ? (
              <span className="flex items-center gap-2.5 px-2 py-1.5 text-sm text-muted-foreground line-through decoration-muted-foreground/40">
                <span className="inline-flex size-4 items-center justify-center bg-success/15 text-success">
                  <Checkmark className="size-3" />
                </span>
                {step.label}
              </span>
            ) : (
              <a
                href={step.href}
                className="group flex items-center gap-2.5 px-2 py-1.5 text-sm transition-colors outline-none hover:bg-accent focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <span className="size-4 border border-dashed border-muted-foreground/50" />
                {step.label}
                <ArrowRight className="ml-auto size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </a>
            )}
          </li>
        ))}
      </ul>
    </Card>
  )
}
