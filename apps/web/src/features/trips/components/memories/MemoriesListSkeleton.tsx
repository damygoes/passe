import { Skeleton } from '@passe/ui'
import { MemoryCardSkeleton } from './MemoryCardSkeleton'

export function MemoriesListSkeleton() {
  return (
    <div className="mt-8">
      <Skeleton className="mb-4 h-5 w-24" />
      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }, (_, i) => (
          <MemoryCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
