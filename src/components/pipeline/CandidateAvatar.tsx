import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { initials } from '@/lib/format'
import { cn } from '@/lib/utils'

export function CandidateAvatar({ name, className }: { name: string; className?: string }) {
  return (
    <Avatar className={cn('size-9', className)}>
      <AvatarFallback className="bg-brand-soft text-xs font-semibold text-brand">{initials(name)}</AvatarFallback>
    </Avatar>
  )
}
