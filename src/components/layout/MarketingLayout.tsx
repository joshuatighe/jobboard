import { Link, Outlet } from 'react-router'

import { Logo } from '@/components/brand/Logo'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { homeFor } from '@/lib/routes'

const YEAR = new Date().getFullYear()

const NAV = [
  { to: '/jobs', label: 'Open roles' },
  { to: '/#seekers', label: 'For job seekers' },
  { to: '/#recruiters', label: 'For recruiters' },
]

/** `contained` wraps pages in the standard content column (the landing page brings its own layout). */
export function MarketingLayout({ contained = false }: { contained?: boolean }) {
  const { status, profile } = useAuth()

  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur-sm">
        <div className="page-x flex h-14 items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-6 text-sm md:flex" aria-label="Site">
            {NAV.map((item) => (
              <a
                key={item.to}
                href={item.to}
                className="text-muted-foreground underline-offset-4 transition-colors outline-none hover:text-foreground hover:underline focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-1.5">
            <ThemeToggle />
            {status === 'signed-in' ? (
              <Button asChild size="sm">
                <Link to={homeFor(profile?.role)}>Open app</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                  <Link to="/sign-in">Sign in</Link>
                </Button>
                <Button asChild size="sm">
                  <Link to="/sign-up">Create account</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1">
        {contained ? (
          <div className="page-x py-8 sm:py-12">
            <Outlet />
          </div>
        ) : (
          <Outlet />
        )}
      </main>
      <footer className="border-t">
        <div className="page-x flex flex-col gap-6 py-10 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <Logo />
            <p className="max-w-sm text-sm text-muted-foreground">
              A two-sided job board. Seekers get every open role ranked by fit; recruiters get a pipeline
              their candidates can see.
            </p>
          </div>
          <p className="meta text-muted-foreground">© {YEAR} JobBoard</p>
        </div>
      </footer>
    </div>
  )
}
