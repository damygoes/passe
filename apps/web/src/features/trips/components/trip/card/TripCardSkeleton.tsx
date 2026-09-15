import { Skeleton } from '@passe/ui/skeleton'

export function TripCardSkeleton() {
  return (
    <div>
      <Skeleton className="h-[210px] w-full rounded-[28px]" />
      <Skeleton className="mt-3.5 h-7 w-3/4" />
      <Skeleton className="mt-2 h-3.5 w-1/2" />
    </div>
  )
}
