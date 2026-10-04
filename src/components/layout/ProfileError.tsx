import { TriangleAlert } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { signOut } from '@/lib/api/auth'

export function ProfileError() {
  const { refreshProfile } = useAuth()

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="inline-flex size-12 items-center justify-center rounded-md border border-destructive/40 text-destructive">
        <TriangleAlert className="size-6" />
      </div>
      <div className="space-y-1">
        <h1 className="text-2xl">We couldn't load your account</h1>
        <p className="text-sm text-muted-foreground">Check your connection and try again.</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => void signOut()}>
          Sign out
        </Button>
        <Button onClick={() => void refreshProfile()}>Try again</Button>
      </div>
    </div>
  )
}
