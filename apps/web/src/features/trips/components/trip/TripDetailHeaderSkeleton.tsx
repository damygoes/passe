import { Skeleton } from '@passe/ui'

export function TripDetailHeaderSkeleton() {
  return (
    <div>
      <Skeleton className="h-7 w-16" />
      <Skeleton className="mt-2 h-8 w-2/3" />
      <Skeleton className="mt-1 h-4 w-1/3" />
      <div className="mt-4 flex gap-1">
        <Skeleton className="h-5 w-14 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <Skeleton className="mt-6 aspect-video w-full rounded-xl" />
      <Skeleton className="mt-4 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-3/4" />
    </div>
  )
}
