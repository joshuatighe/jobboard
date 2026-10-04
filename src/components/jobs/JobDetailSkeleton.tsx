import { Skeleton } from '@/components/ui/skeleton'

export function JobDetailSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading job">
      <Skeleton className="h-5 w-24" />
      <div className="mt-6 flex gap-4">
        <Skeleton className="size-14 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-8 w-2/3 max-w-md" />
          <Skeleton className="h-4 w-1/2 max-w-xs" />
        </div>
      </div>
      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-3">
          {Array.from({ length: 8 }, (_, i) => (
            <Skeleton key={i} className="h-4" style={{ width: `${90 - (i % 3) * 15}%` }} />
          ))}
        </div>
        <Skeleton className="h-48 rounded-xl" />
      </div>
    </div>
  )
}
