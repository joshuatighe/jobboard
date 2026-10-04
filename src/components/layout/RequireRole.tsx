import { Navigate, Outlet, useLocation } from 'react-router'

import { FullPageLoader } from '@/components/layout/FullPageLoader'
import { ProfileError } from '@/components/layout/ProfileError'
import { useAuth } from '@/hooks/useAuth'
import { homeFor } from '@/lib/routes'
import type { UserRole } from '@/lib/types'

/** UX-only route guard. Real authorization is enforced by RLS. */
export function RequireRole({ role }: { role?: UserRole }) {
  const { status, profile } = useAuth()
  const location = useLocation()

  if (status === 'loading') return <FullPageLoader />
  if (status === 'signed-out') {
    return <Navigate to="/sign-in" replace state={{ from: location.pathname }} />
  }
  if (!profile) return <ProfileError />
  if (role && profile.role !== role) return <Navigate to={homeFor(profile.role)} replace />
  return <Outlet />
}
