import { LogOut, UserRound } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/hooks/useAuth'
import { signOut } from '@/lib/api/auth'
import { initials } from '@/lib/format'

export function UserMenu() {
  const { profile, user } = useAuth()
  const navigate = useNavigate()
  const name = profile?.full_name || user?.email || 'Account'

  async function handleSignOut() {
    try {
      await signOut()
      navigate('/')
    } catch {
      toast.error("Couldn't sign out. Try again.")
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label="Account menu">
          <Avatar className="size-7">
            <AvatarFallback>{initials(name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="truncate text-sm font-medium">{name}</div>
          <div className="truncate text-xs text-muted-foreground">{user?.email}</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {profile?.role === 'seeker' && (
          <DropdownMenuItem asChild>
            <Link to="/profile">
              <UserRound /> Profile
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => void handleSignOut()}>
          <LogOut /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
