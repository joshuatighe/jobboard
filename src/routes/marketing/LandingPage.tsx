import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'

import { ProductPreview } from '@/components/marketing/ProductPreview'
import { Button } from '@/components/ui/button'
import { MATCH_WEIGHTS } from '@/lib/matching'
import { cn } from '@/lib/utils'

const TODAY = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

const CRITERIA: { term: string; body: string; weight: number }[] = [
  {
    term: 'Experience level',
    body: 'Full points at your level, half a step either side. A senior role is a near miss for a mid-level engineer, not a zero.',
    weight: MATCH_WEIGHTS.experience,
  },
  {
    term: 'Location',
    body: 'One of the places you named, or a remote role if you said remote is fine.',
    weight: MATCH_WEIGHTS.location,
  },
  {
    term: 'Pay',
    body: 'The top of the range clears your minimum. Hourly roles are annualized at 2,080 hours.',
    weight: MATCH_WEIGHTS.pay,
  },
  {
    term: 'Skills',
    body: 'The overlap between the skills on the posting and the skills on your profile.',
    weight: MATCH_WEIGHTS.skills,
  },
  {
    term: 'Employment type',
    body: 'Full-time, part-time, contract or internship, if you have a preference.',
    weight: MATCH_WEIGHTS.employmentType,
  },
]

const SEEKER_POINTS = [
  'Search by keyword and filter by pay, location, remote and experience level. The filters live in the URL, so a search can be sent to someone.',
  'Set your preferences once. Every open role gets a score from 0 to 100, and the reasons are printed under the title.',
  'Upload one PDF resume. Applying is a cover note and a click; the resume is attached for you.',
  'Every application shows its stage and its full history, updated the moment a recruiter moves it.',
]

const RECRUITER_POINTS = [
  'Post a role with title, description, pay range, location or remote, level and type. Save a draft or publish.',
  'One dashboard of every posting with live applicant counts: new, in review, interviewing, offer.',
  'A five-column board. Move candidates forward or back in one click; offers and rejections ask first.',
  'Each candidate on one sheet: profile, work history, the resume they sent and their cover note.',
]

const STAGES = [
  { label: 'Applied', note: 'The candidate sends their resume and a note.' },
  { label: 'In review', note: 'Someone on the team opened it.' },
  { label: 'Interviewing', note: 'The current stage, marked on both sides.', current: true },
  { label: 'Offer', note: 'Confirmed before the candidate sees it.' },
]

function NumberedList({ items }: { items: string[] }) {
  return (
    <ol className="mt-8 border-t">
      {items.map((item, i) => (
        <li key={item} className="grid grid-cols-[2.5rem_1fr] gap-4 border-b py-4">
          <span className="meta pt-1 text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>
          <p className="text-[15px] leading-relaxed">{item}</p>
        </li>
      ))}
    </ol>
  )
}

export function LandingPage() {
  return (
    <>
      {/* Front page */}
      <section className="page-x pt-14 pb-20 sm:pt-20 sm:pb-28">
        <p className="meta text-muted-foreground">{TODAY} · Jobs and hiring</p>
        <div className="mt-6 grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <h1 className="max-w-3xl text-display">
              Every open role, ranked by how well it <span className="highlight">fits you.</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
              JobBoard scores each posting against your level, pay, location, job type and skills, and prints the
              reasons next to the score. Recruiters get a pipeline their candidates can see.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="sm:min-w-44">
                <Link to="/sign-up?role=seeker">
                  Find a job <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="sm:min-w-44">
                <Link to="/sign-up?role=recruiter">Post a job</Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Free for job seekers. No account needed to{' '}
              <Link to="/jobs" className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground">
                browse the open roles
              </Link>
              .
            </p>
          </div>
          <div className="-mx-5 sm:mx-0 lg:col-span-5">
            <ProductPreview />
          </div>
        </div>
      </section>

      {/* How the score works */}
      <section className="border-t">
        <div className="page-x grid gap-10 py-20 sm:py-28 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="meta text-muted-foreground">The score</p>
            <h2 className="mt-3 text-headline">Five things decide it. Nothing hidden.</h2>
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
              Each criterion you fill in adds its weight to the possible total. The score is the share a job earns.
              Leave something blank and it is skipped, not counted against the job.
            </p>
          </div>
          <dl className="border-t lg:col-span-8">
            {CRITERIA.map((c, i) => (
              <div key={c.term} className="grid grid-cols-[2.5rem_1fr_auto] gap-4 border-b py-5">
                <span className="meta pt-1 text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <dt className="font-serif text-xl leading-tight tracking-tight">{c.term}</dt>
                  <dd className="mt-1.5 max-w-lg text-[15px] leading-relaxed text-muted-foreground">{c.body}</dd>
                </div>
                <dd className="meta pt-1 text-muted-foreground" data-tabular>
                  {c.weight} pts
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Both sides */}
      <section className="border-t">
        <div className="page-x grid gap-16 py-20 sm:py-28 lg:grid-cols-2 lg:gap-0 lg:divide-x">
          <div id="seekers" className="scroll-mt-20 lg:pr-12">
            <p className="meta text-muted-foreground">For job seekers</p>
            <h2 className="mt-3 text-headline">Say once what you want. Read the roles that fit.</h2>
            <NumberedList items={SEEKER_POINTS} />
            <Button asChild variant="link" className="mt-6 text-[15px]">
              <Link to="/sign-up?role=seeker">
                Create a seeker account <ArrowRight />
              </Link>
            </Button>
          </div>
          <div id="recruiters" className="scroll-mt-20 lg:pl-12">
            <p className="meta text-muted-foreground">For recruiters</p>
            <h2 className="mt-3 text-headline">Post the role. Read the people, not the inbox.</h2>
            <NumberedList items={RECRUITER_POINTS} />
            <Button asChild variant="link" className="mt-6 text-[15px]">
              <Link to="/sign-up?role=recruiter">
                Create a recruiter account <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* One pipeline, two readers */}
      <section className="border-t">
        <div className="page-x py-20 sm:py-28">
          <div className="max-w-2xl">
            <p className="meta text-muted-foreground">One pipeline</p>
            <h2 className="mt-3 text-headline">What the recruiter sees, the candidate sees.</h2>
            <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
              A status change is the notification. There is no email to lose and no guessing on either side.
            </p>
          </div>
          <ol className="mt-12 grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {STAGES.map((stage, i) => (
              <li key={stage.label} className={cn('bg-background p-5', stage.current && 'bg-highlight text-highlight-foreground')}>
                <p className={cn('meta', stage.current ? 'text-highlight-foreground/70' : 'text-muted-foreground')}>
                  Stage {i + 1}
                </p>
                <p className="mt-6 font-serif text-2xl leading-none tracking-tight">{stage.label}</p>
                <p className={cn('mt-3 text-sm leading-relaxed', stage.current ? 'text-highlight-foreground/80' : 'text-muted-foreground')}>
                  {stage.note}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Close */}
      <section className="border-t">
        <div className="page-x flex flex-col gap-8 py-20 sm:py-28 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="max-w-2xl text-headline">
            Start with the open roles. An account takes a minute when you find one.
          </h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link to="/jobs">Browse open roles</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/sign-up?role=recruiter">Post a job</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
