import { ArrowRight, CircleCheck, MapPin, Sparkles } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const PREVIEW_JOBS = [
  {
    company: 'Lumen AI',
    tile: 'from-violet-500 to-indigo-500',
    title: 'Senior Frontend Engineer',
    location: 'Remote · US',
    pay: '$170K – $210K',
    score: 96,
    reasons: ['Your level', 'Remote', '3 matching skills'],
  },
  {
    company: 'Parcel',
    tile: 'from-amber-400 to-orange-500',
    title: 'Product Engineer, Growth',
    location: 'San Francisco, CA',
    pay: '$160K – $195K',
    score: 88,
    reasons: ['Meets your pay', 'San Francisco'],
  },
  {
    company: 'Fernhill Health',
    tile: 'from-emerald-400 to-teal-500',
    title: 'Full-Stack Engineer',
    location: 'New York, NY',
    pay: '$150K – $185K',
    score: 74,
    reasons: ['Near your level', '2 matching skills'],
  },
]

function ScoreRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 16
  return (
    <div className="relative size-11 shrink-0">
      <svg viewBox="0 0 40 40" className="size-full -rotate-90">
        <circle cx="20" cy="20" r="16" className="fill-none stroke-border" strokeWidth="3.5" />
        <circle
          cx="20"
          cy="20"
          r="16"
          className="fill-none stroke-brand"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - score / 100)}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold tabular-nums">
        {score}
      </span>
    </div>
  )
}

/** Static, illustrative mock of the product for the landing page hero. */
export function ProductPreview() {
  return (
    <div className="relative mx-auto w-full max-w-4xl">
      <div className="absolute -inset-x-8 -top-8 -bottom-8 -z-10 rounded-[2rem] bg-gradient-to-b from-brand/20 via-brand/5 to-transparent blur-2xl" />
      <div className="overflow-hidden rounded-2xl border bg-card/80 shadow-2xl shadow-brand/10 ring-1 ring-black/5 backdrop-blur dark:ring-white/5">
        <div className="flex items-center gap-2 border-b bg-muted/40 px-4 py-3">
          <span className="size-2.5 rounded-full bg-red-400/80" />
          <span className="size-2.5 rounded-full bg-amber-400/80" />
          <span className="size-2.5 rounded-full bg-emerald-400/80" />
          <div className="mx-auto rounded-md border bg-background/70 px-3 py-0.5 text-[11px] text-muted-foreground">
            jobboard.app/for-you
          </div>
        </div>
        <div className="grid gap-0 md:grid-cols-[1fr_15rem]">
          <div className="space-y-3 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-sm font-semibold">
                  <Sparkles className="size-4 text-brand" /> For you
                </div>
                <p className="text-xs text-muted-foreground">Ranked by fit with your profile</p>
              </div>
              <Badge variant="brand">24 new</Badge>
            </div>
            {PREVIEW_JOBS.map((job, i) => (
              <div
                key={job.title}
                className={cn(
                  'flex items-center gap-4 rounded-xl border bg-background p-3 text-left sm:p-4',
                  i === 0 && 'border-brand/40 ring-2 ring-brand/10',
                )}
              >
                <div
                  className={cn(
                    'flex size-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-sm font-bold text-white',
                    job.tile,
                  )}
                >
                  {job.company[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{job.title}</div>
                  <div className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                    {job.company} <span aria-hidden>·</span> <MapPin className="size-3" />
                    {job.location} <span aria-hidden className="hidden sm:inline">·</span>
                    <span className="hidden sm:inline">{job.pay}</span>
                  </div>
                  <div className="mt-2 hidden flex-wrap gap-1 sm:flex">
                    {job.reasons.map((r) => (
                      <span
                        key={r}
                        className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                      >
                        <CircleCheck className="size-2.5 text-success" /> {r}
                      </span>
                    ))}
                  </div>
                </div>
                <ScoreRing score={job.score} />
              </div>
            ))}
          </div>
          <div className="hidden border-l bg-muted/20 p-6 md:block">
            <div className="text-sm font-semibold">Applications</div>
            <p className="text-xs text-muted-foreground">Live status, no guessing</p>
            <ol className="mt-5 space-y-5">
              {[
                { label: 'Applied', when: 'Sep 28', done: true },
                { label: 'In review', when: 'Sep 30', done: true },
                { label: 'Interviewing', when: 'Today', done: true, current: true },
                { label: 'Offer', when: '', done: false },
              ].map((step) => (
                <li key={step.label} className="flex items-start gap-3">
                  <span
                    className={cn(
                      'mt-0.5 flex size-4 items-center justify-center rounded-full border-2',
                      step.done ? 'border-brand bg-brand' : 'border-border',
                      step.current && 'ring-4 ring-brand/20',
                    )}
                  />
                  <div className="text-xs">
                    <div className={cn('font-medium', !step.done && 'text-muted-foreground')}>
                      {step.label}
                    </div>
                    {step.when && <div className="text-muted-foreground">{step.when}</div>}
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-6 flex items-center gap-1 text-xs font-medium text-brand">
              Lumen AI · Senior Frontend <ArrowRight className="size-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
