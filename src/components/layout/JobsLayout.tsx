import { AppShell } from '@/components/layout/AppShell'
import { FullPageLoader } from '@/components/layout/FullPageLoader'
import { MarketingLayout } from '@/components/layout/MarketingLayout'
import { useAuth } from '@/hooks/useAuth'

/**
 * The public job pages keep signed-in users inside the app shell, so "Search" in the app nav
 * doesn't drop them onto the marketing site. Visitors get the marketing header.
 */
export function JobsLayout() {
  const { status, profile } = useAuth()

  if (status === 'loading') return <FullPageLoader />
  if (status === 'signed-in' && profile) return <AppShell />
  return <MarketingLayout contained />
}
