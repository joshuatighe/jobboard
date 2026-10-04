import { Skeleton } from '@/components/ui/skeleton'

export function JobCardSkeleton() {
  return (
    <div className="grid grid-cols-[auto_1fr] gap-x-4 py-5 sm:gap-x-5" aria-hidden>
      <Skeleton className="size-10" />
      <div className="space-y-2.5">
        <div className="flex justify-between gap-6">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-4 w-1/3" />
        <div className="flex gap-1.5 pt-1">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
    </div>
  )
}
