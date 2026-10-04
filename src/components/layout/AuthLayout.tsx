import type { ReactNode } from 'react'

import { Logo } from '@/components/brand/Logo'
import { ThemeToggle } from '@/components/layout/ThemeToggle'

const POINTS = [
  ['Every open role, scored against your level, pay, location and skills.', 'The reasons are printed on each listing.'],
  ['One resume, kept on file.', 'Applying is a cover note and a click.'],
  ['A tracker that moves when the recruiter does.', 'Applied, in review, interviewing, offer.'],
]

export function AuthLayout({
  title,
  description,
  children,
  footer,
}: {
  title: string
  description: string
  children: ReactNode
  footer: ReactNode
}) {
  return (
    <div className="grid min-h-svh lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
      <div className="flex flex-col px-5 py-5 sm:px-10">
        <div className="flex items-center justify-between">
          <Logo />
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center py-12">
          <div className="mx-auto w-full max-w-sm">
            <h1 className="text-title sm:text-4xl">{title}</h1>
            <p className="mt-2 text-[15px] text-muted-foreground">{description}</p>
            <div className="mt-8">{children}</div>
            <div className="mt-8 text-sm text-muted-foreground">{footer}</div>
          </div>
        </div>
      </div>
      <aside className="hidden border-l bg-muted/40 lg:flex lg:flex-col lg:justify-between lg:p-12" aria-label="What JobBoard does">
        <p className="meta text-muted-foreground">What you get</p>
        <div>
          <p className="font-serif text-headline">
            Open roles, <span className="highlight">ranked by fit</span>. A pipeline both sides can read.
          </p>
          <ol className="mt-12 border-t">
            {POINTS.map(([lead, rest], i) => (
              <li key={lead} className="grid grid-cols-[2.5rem_1fr] gap-4 border-b py-4">
                <span className="meta pt-1 text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>
                <p className="text-[15px] leading-relaxed">
                  {lead} <span className="text-muted-foreground">{rest}</span>
                </p>
              </li>
            ))}
          </ol>
        </div>
      </aside>
    </div>
  )
}
