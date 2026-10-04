import {
  ArrowRight,
  BriefcaseBusiness,
  FileUp,
  Filter,
  Inbox,
  KanbanSquare,
  ListChecks,
  Sparkles,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { Link } from 'react-router'

import { ProductPreview } from '@/components/marketing/ProductPreview'
import { Button } from '@/components/ui/button'

const COMPANIES = ['Lumen AI', 'Parcel', 'Fernhill Health', 'Quarry', 'Tandem', 'Orbital', 'Basalt']

type Feature = { icon: LucideIcon; title: string; body: string }

const SEEKER_FEATURES: Feature[] = [
  {
    icon: Sparkles,
    title: 'A feed made for you',
    body: 'Jobs ranked against your level, pay, location and skills, with the reasons shown on every card.',
  },
  {
    icon: Filter,
    title: 'Search that respects your time',
    body: 'Keyword search with filters for pay, location, remote and experience level. No sponsored clutter.',
  },
  {
    icon: FileUp,
    title: 'One profile, every application',
    body: 'Add your experience and upload a resume once, then apply anywhere in a single click.',
  },
  {
    icon: Inbox,
    title: 'Always know where you stand',
    body: 'Every application, its current stage and its full timeline in one tracker.',
  },
]

const RECRUITER_FEATURES: Feature[] = [
  {
    icon: BriefcaseBusiness,
    title: 'Post in minutes',
    body: 'Title, pay range, location, level and description. Publish now or save a draft.',
  },
  {
    icon: ListChecks,
    title: 'Every posting at a glance',
    body: 'Open, draft and closed roles with live applicant counts in one dashboard.',
  },
  {
    icon: KanbanSquare,
    title: 'A pipeline that just works',
    body: 'Move candidates from Applied to Offer. They see every update instantly.',
  },
  {
    icon: Users,
    title: 'Context on every candidate',
    body: 'Experience, skills, resume and cover note side by side, with no inbox digging.',
  },
]

function FeatureGrid({ features }: { features: Feature[] }) {
  return (
    <div className="grid gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-2">
      {features.map(({ icon: Icon, title, body }) => (
        <div key={title} className="bg-background p-6 sm:p-8">
          <div className="mb-4 inline-flex size-9 items-center justify-center rounded-lg border bg-muted/50">
            <Icon className="size-[18px] text-brand" />
          </div>
          <h3 className="font-semibold">{title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
        </div>
      ))}
    </div>
  )
}

function SectionIntro({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <div className="mb-10 max-w-2xl">
      <p className="text-sm font-medium text-brand">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">{title}</h2>
      <p className="mt-3 text-lg text-muted-foreground">{body}</p>
    </div>
  )
}

export function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black_40%,transparent_100%)] bg-[size:48px_48px] opacity-60"
        />
        <div
          aria-hidden
          className="absolute top-[-12rem] left-1/2 -z-10 h-[32rem] w-[56rem] -translate-x-1/2 rounded-full bg-brand/20 blur-3xl"
        />
        <div className="mx-auto max-w-6xl px-4 pt-20 pb-16 text-center sm:px-6 sm:pt-28">
          <Link
            to="/sign-up"
            className="group mx-auto mb-8 inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs font-medium shadow-xs backdrop-blur transition-colors hover:bg-accent"
          >
            <span className="rounded-full bg-brand px-1.5 py-px text-[10px] font-semibold text-brand-foreground">
              NEW
            </span>
            Matching that explains itself
            <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <h1 className="mx-auto max-w-4xl text-5xl leading-[1.05] font-semibold tracking-tighter sm:text-7xl">
            Find work that fits.
            <br />
            <span className="bg-gradient-to-r from-brand via-indigo-500 to-sky-500 bg-clip-text text-transparent">
              Hire people who do.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            JobBoard ranks every opening against what you actually want, and gives recruiters a
            pipeline that keeps candidates in the loop. Hiring, minus the noise.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" variant="brand" className="w-full sm:w-auto">
              <Link to="/sign-up?role=seeker">
                I'm looking for a job <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
              <Link to="/sign-up?role=recruiter">I'm hiring</Link>
            </Button>
          </div>
        </div>
        <div className="px-4 pb-24 sm:px-6">
          <ProductPreview />
        </div>
      </section>

      {/* Logo strip */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <p className="text-center text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Teams hiring on JobBoard
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {COMPANIES.map((name) => (
              <span
                key={name}
                className="text-lg font-semibold tracking-tight text-muted-foreground/70"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Seekers */}
      <section id="seekers" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-24 sm:px-6">
        <SectionIntro
          eyebrow="For job seekers"
          title="Stop scrolling. Start matching."
          body="Tell us what you're looking for once. We'll do the sorting, and show our work."
        />
        <FeatureGrid features={SEEKER_FEATURES} />
      </section>

      {/* Recruiters */}
      <section id="recruiters" className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl scroll-mt-20 px-4 py-24 sm:px-6">
          <SectionIntro
            eyebrow="For recruiters"
            title="Your hiring pipeline, without the spreadsheet."
            body="Post a role, review applicants and move them forward, all in one place."
          />
          <FeatureGrid features={RECRUITER_FEATURES} />
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="relative isolate overflow-hidden rounded-3xl bg-zinc-950 px-6 py-16 text-center text-white sm:px-16">
          <div
            aria-hidden
            className="absolute -top-24 left-1/2 -z-10 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-brand/40 blur-3xl"
          />
          <h2 className="text-3xl font-semibold sm:text-4xl">Your next move starts here.</h2>
          <p className="mx-auto mt-3 max-w-xl text-zinc-400">
            Free for job seekers. Set up a company profile and post your first role in under five
            minutes.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="bg-white text-zinc-950 hover:bg-white/90">
              <Link to="/sign-up?role=seeker">Find a job</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Link to="/sign-up?role=recruiter">Post a job</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
