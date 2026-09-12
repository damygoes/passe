import { Skeleton } from '@passe/ui'

export function TripDetailHeaderSkeleton() {
  return (
    <div>
      <Skeleton className="h-[380px] w-full rounded-[34px]" />
      <div className="relative -mt-[70px] mx-6 rounded-[34px] bg-popover p-9 shadow-md">
        <Skeleton className="h-3 w-40" />
        <Skeleton className="mt-3 h-14 w-2/3" />
        <div className="mt-4 flex gap-2">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
      </div>
    </div>
  )
}
