import { Skeleton } from '@/components/ui/skeleton'

export function ProfilePageSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading profile"
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]"
    >
      <div className="grid gap-6 lg:order-first">
        {[5, 3, 4].map((rows, i) => (
          <div key={i} className="space-y-4 border p-6">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-56" />
            {Array.from({ length: rows }, (_, j) => (
              <Skeleton key={j} className="h-9" />
            ))}
          </div>
        ))}
      </div>
      <div className="order-first grid content-start gap-6 lg:order-none">
        <Skeleton className="h-64" />
        <Skeleton className="h-48" />
      </div>
    </div>
  )
}
