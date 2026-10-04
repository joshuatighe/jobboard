import { Skeleton } from '@/components/ui/skeleton'

export function JobCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-xs" aria-hidden>
      <div className="flex gap-4">
        <Skeleton className="size-10 rounded-lg" />
        <div className="flex-1 space-y-2">
          <div className="flex justify-between gap-4">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-4 w-1/3" />
          <div className="flex gap-1.5 pt-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
