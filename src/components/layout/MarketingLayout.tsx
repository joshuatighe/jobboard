import { Link, Outlet } from 'react-router'

import { Logo } from '@/components/brand/Logo'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { homeFor } from '@/lib/routes'

const YEAR = new Date().getFullYear()

export function MarketingLayout() {
  const { status, profile } = useAuth()

  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-40 border-b border-transparent bg-background/70 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-8 px-4 sm:px-6">
          <Logo />
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <Link to="/jobs" className="transition-colors hover:text-foreground">
              Browse jobs
            </Link>
            <a href="/#seekers" className="transition-colors hover:text-foreground">
              For job seekers
            </a>
            <a href="/#recruiters" className="transition-colors hover:text-foreground">
              For recruiters
            </a>
          </nav>
          <div className="ml-auto flex items-center gap-2">
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
                  <Link to="/sign-up">Get started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Logo />
          <p>© {YEAR} JobBoard. Hiring, minus the noise.</p>
        </div>
      </footer>
    </div>
  )
}
