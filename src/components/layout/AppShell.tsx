import { useState } from 'react'
import { Add, type CarbonIconType, Dashboard, Menu, Recommend, Search, Task, User } from '@carbon/icons-react'
import { Link, NavLink, Outlet } from 'react-router'

import { Logo } from '@/components/brand/Logo'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { UserMenu } from '@/components/layout/UserMenu'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useAuth } from '@/hooks/useAuth'
import { homeFor } from '@/lib/routes'
import type { UserRole } from '@/lib/types'
import { cn } from '@/lib/utils'

type NavItem = { to: string; label: string; icon: CarbonIconType }

const NAV: Record<UserRole, NavItem[]> = {
  seeker: [
    { to: '/for-you', label: 'For you', icon: Recommend },
    { to: '/jobs', label: 'Search', icon: Search },
    { to: '/applications', label: 'Applications', icon: Task },
  ],
  recruiter: [{ to: '/dashboard', label: 'Postings', icon: Dashboard }],
}

/** Desktop: section links on the masthead, the current one underlined in ink. */
function TopNav({ items }: { items: NavItem[] }) {
  return items.map(({ to, label }) => (
    <NavLink
      key={to}
      to={to}
      className={({ isActive }) =>
        cn(
          '-mb-px inline-flex h-14 items-center border-b-2 border-transparent text-sm font-medium text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          isActive && 'border-foreground text-foreground',
        )
      }
    >
      {label}
    </NavLink>
  ))
}

/** Mobile sheet: the same links, one per row, with icons. */
function MenuNav({ items, onNavigate }: { items: NavItem[]; onNavigate: () => void }) {
  return items.map(({ to, label, icon: Icon }) => (
    <NavLink
      key={to}
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 border-b py-3 font-serif text-xl text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          isActive && 'text-foreground',
        )
      }
    >
      <Icon className="size-5" />
      {label}
    </NavLink>
  ))
}

export function AppShell() {
  const { profile } = useAuth()
  const [open, setOpen] = useState(false)
  const role = profile?.role ?? 'seeker'
  const items = NAV[role]
  const menuItems =
    role === 'recruiter'
      ? [...items, { to: '/postings/new', label: 'Post a job', icon: Add }]
      : [...items, { to: '/profile', label: 'Profile', icon: User }]

  return (
    <div className="min-h-svh">
      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur-sm">
        <div className="page-x flex h-14 items-center gap-8">
          <Logo to={homeFor(profile?.role)} />
          <nav className="hidden h-14 items-stretch gap-6 md:flex" aria-label="Primary">
            <TopNav items={items} />
          </nav>
          <div className="ml-auto flex items-center gap-1.5">
            {role === 'recruiter' && (
              <Button asChild size="sm" className="hidden sm:inline-flex">
                <Link to="/postings/new">
                  <Add /> Post a job
                </Link>
              </Button>
            )}
            <ThemeToggle />
            <UserMenu />
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon-sm" className="md:hidden" aria-label="Open menu">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <SheetHeader>
                  <SheetTitle className="sr-only">Navigation</SheetTitle>
                  <Logo to={homeFor(profile?.role)} />
                </SheetHeader>
                <nav className="flex flex-col px-5" aria-label="Primary">
                  <MenuNav items={menuItems} onNavigate={() => setOpen(false)} />
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <main className="page-x py-8 sm:py-12">
        <Outlet />
      </main>
    </div>
  )
}
