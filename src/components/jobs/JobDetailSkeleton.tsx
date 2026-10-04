import { Skeleton } from '@/components/ui/skeleton'

export function JobDetailSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading job">
      <Skeleton className="h-4 w-24" />
      <div className="mt-6 grid gap-6 border-b pb-8 sm:grid-cols-[auto_1fr]">
        <Skeleton className="size-16" />
        <div className="space-y-3">
          <Skeleton className="h-10 w-2/3 max-w-md" />
          <Skeleton className="h-4 w-1/2 max-w-xs" />
          <div className="flex gap-1.5 pt-1">
            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
        <div className="space-y-3">
          {Array.from({ length: 8 }, (_, i) => (
            <Skeleton key={i} className="h-4" style={{ width: `${90 - (i % 3) * 15}%` }} />
          ))}
        </div>
        <Skeleton className="h-44 rounded-xl" />
      </div>
    </div>
  )
}
