import { Skeleton } from '@passe/ui/skeleton'

export default function TripDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* PageHeader skeleton */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-36" />
        </div>
        <Skeleton className="h-9 w-20" />
      </div>

      {/* Countries badges */}
      <div className="mt-4 flex gap-1">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>

      {/* Cover image */}
      <Skeleton className="mt-6 aspect-video w-full rounded-xl" />

      {/* Memory cards */}
      <div className="mt-8 space-y-4">
        <Skeleton className="h-6 w-24" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-xl ring-1 ring-foreground/10">
            <Skeleton className="aspect-video w-full" />
            <div className="p-4 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
