import { TripCardSkeleton } from '../card/TripCardSkeleton'

export function TripsListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 w-full rounded-xl">
      {Array.from({ length: 10 }, (_, i) => (
        <TripCardSkeleton key={i} />
      ))}
    </div>
  )
}
