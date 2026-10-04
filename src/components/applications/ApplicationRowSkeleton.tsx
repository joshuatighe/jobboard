import { Skeleton } from '@/components/ui/skeleton'

export function ApplicationRowSkeleton() {
  return (
    <div className="grid grid-cols-[auto_1fr] gap-x-4 py-5 sm:gap-x-5" aria-hidden>
      <Skeleton className="size-10" />
      <div className="space-y-2.5">
        <div className="flex justify-between gap-4">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-4 w-1/3" />
        <div className="flex gap-6 pt-2">
          <Skeleton className="h-1.5 w-40" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    </div>
  )
}
