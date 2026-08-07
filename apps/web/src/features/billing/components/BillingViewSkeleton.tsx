import { Skeleton } from '@passe/ui/skeleton'

export function BillingViewSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <Skeleton className="h-96 w-full" />
      <Skeleton className="h-96 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  )
}
