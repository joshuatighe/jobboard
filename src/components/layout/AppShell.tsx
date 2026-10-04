import { useState } from 'react'
import {
  Inbox,
  LayoutDashboard,
  Menu,
  Plus,
  Search,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
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

type NavItem = { to: string; label: string; icon: LucideIcon }

const NAV: Record<UserRole, NavItem[]> = {
  seeker: [
    { to: '/for-you', label: 'For you', icon: Sparkles },
    { to: '/jobs', label: 'Search', icon: Search },
    { to: '/applications', label: 'Applications', icon: Inbox },
  ],
  recruiter: [{ to: '/dashboard', label: 'Postings', icon: LayoutDashboard }],
}

function NavItems({ items, onNavigate }: { items: NavItem[]; onNavigate?: () => void }) {
  return items.map(({ to, label, icon: Icon }) => (
    <NavLink
      key={to}
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground',
          isActive && 'bg-accent text-foreground',
        )
      }
    >
      <Icon className="size-4" />
      {label}
    </NavLink>
  ))
}

export function AppShell() {
  const { profile } = useAuth()
  const [open, setOpen] = useState(false)
  const role = profile?.role ?? 'seeker'
  const items = NAV[role]

  return (
    <div className="min-h-svh bg-muted/30">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4 sm:px-6">
          <Logo to={homeFor(profile?.role)} />
          <nav className="hidden items-center gap-1 md:flex">
            <NavItems items={items} />
          </nav>
          <div className="ml-auto flex items-center gap-1.5">
            {role === 'recruiter' && (
              <Button asChild variant="brand" size="sm" className="hidden sm:inline-flex">
                <Link to="/postings/new">
                  <Plus /> Post a job
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
              <SheetContent side="left" className="w-64">
                <SheetHeader>
                  <SheetTitle className="sr-only">Navigation</SheetTitle>
                  <Logo to={homeFor(profile?.role)} />
                </SheetHeader>
                <nav className="flex flex-col gap-1 px-2">
                  <NavItems items={items} onNavigate={() => setOpen(false)} />
                  {role === 'recruiter' && (
                    <NavItems
                      items={[{ to: '/postings/new', label: 'Post a job', icon: Plus }]}
                      onNavigate={() => setOpen(false)}
                    />
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <Outlet />
      </main>
    </div>
  )
}
