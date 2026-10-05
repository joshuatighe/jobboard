import { cn } from '@/lib/utils'

/**
 * The For-you feed and the tracker, typeset as a classifieds column. Static and illustrative; the
 * real feed is `JobCard` with `MatchReasons`, and this mirrors its order: index, title, meta, reasons, score.
 */
const LISTINGS = [
  {
    title: 'Senior Frontend Engineer',
    company: 'Lumen AI',
    location: 'Remote (US)',
    pay: '$180K – $220K',
    score: 96,
    reasons: ['Your level', 'Remote', 'Meets your pay', '3 matching skills'],
  },
  {
    title: 'Product Engineer, Growth',
    company: 'Parcel',
    location: 'San Francisco, CA',
    pay: '$160K – $195K',
    score: 88,
    reasons: ['San Francisco', 'Meets your pay', 'Full-time'],
  },
  {
    title: 'Full-Stack Engineer',
    company: 'Fernhill Health',
    location: 'New York, NY',
    pay: '$150K – $185K',
    score: 74,
    reasons: ['Near your level', 'New York', '2 matching skills'],
  },
]

const STEPS = [
  { label: 'Applied', when: 'Sep 28', done: true },
  { label: 'In review', when: 'Sep 30', done: true },
  { label: 'Interviewing', when: 'Today', done: true, current: true },
  { label: 'Offer', when: '', done: false },
]

export function ProductPreview() {
  return (
    <div className="border-y lg:border" aria-label="Example of the For-you feed and the application tracker">
      <div className="flex items-baseline justify-between border-b px-5 py-3">
        <p className="meta">For you · Ranked by fit</p>
        <p className="meta text-muted-foreground">24 open</p>
      </div>
      <ol>
        {LISTINGS.map((job, i) => (
          <li key={job.title} className="grid grid-cols-[2rem_1fr_auto] gap-x-3 border-b px-5 py-4">
            <span className="meta pt-1.5 text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>
            <div className="min-w-0">
              <p className="font-serif text-xl leading-tight tracking-tight">{job.title}</p>
              <p className="mt-1 truncate text-[13px] text-muted-foreground">
                {job.company} · {job.location} · <span data-tabular>{job.pay}</span>
              </p>
              <p className="mt-2 text-[13px] leading-snug text-muted-foreground">
                {job.reasons.map((r, j) => (
                  <span key={r}>
                    {j > 0 && <span aria-hidden> · </span>}
                    <span className="text-foreground">{r}</span>
                  </span>
                ))}
              </p>
            </div>
            <p className="self-start pt-0.5 text-right">
              <span
                className={cn(
                  'font-serif text-3xl leading-none tracking-tight tabular-nums',
                  i === 0 ? 'highlight' : 'text-foreground',
                )}
              >
                {job.score}
              </span>
              <span className="meta mt-1 block text-muted-foreground">match</span>
            </p>
          </li>
        ))}
      </ol>
      <div className="px-5 py-4">
        <div className="flex items-baseline justify-between">
          <p className="meta">Applications · Lumen AI</p>
          <p className="meta text-muted-foreground">Stage 3 of 4</p>
        </div>
        <ol className="mt-3 grid grid-cols-4 gap-1">
          {STEPS.map((step) => (
            <li key={step.label} className="min-w-0">
              <span
                aria-hidden
                className={cn(
                  'block h-1.5',
                  step.done ? 'bg-foreground' : 'bg-border',
                  step.current && 'bg-highlight',
                )}
              />
              <p className={cn('mt-2 truncate text-[13px] font-medium', !step.done && 'text-muted-foreground')}>
                {step.label}
              </p>
              <p className="meta text-muted-foreground">{step.when || '—'}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
