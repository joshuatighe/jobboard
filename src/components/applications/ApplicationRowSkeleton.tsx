import { Skeleton } from '@/components/ui/skeleton'

export function ApplicationRowSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-xs sm:p-5" aria-hidden>
      <div className="flex gap-4">
        <Skeleton className="size-10 rounded-lg" />
        <div className="flex-1 space-y-2">
          <div className="flex justify-between gap-4">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-4 w-1/3" />
          <div className="flex gap-6 pt-3">
            <Skeleton className="h-1.5 w-40 rounded-full" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      </div>
    </div>
  )
}
