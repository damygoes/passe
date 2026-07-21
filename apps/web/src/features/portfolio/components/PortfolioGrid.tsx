import { publicTripRoute } from '@/lib/routes'
import { NoPublicTripsEmpty } from './NoPublicTripsEmpty'
import { PortfolioTripCard } from './PortfolioTripCard'

interface TripData {
  id: string
  title: string
  startDate: Date | string
  endDate: Date | string
  countries: string[]
  coverImageUrl?: string | null
  coverImagePlaceholder?: string | null
  coverImageSrcset?: Record<string, string> | null
}

interface Props {
  slug: string
  displayName: string
  trips: TripData[]
}

export function PortfolioGrid({ slug, displayName, trips }: Props) {
  if (trips.length === 0) {
    return <NoPublicTripsEmpty displayName={displayName} />
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {trips.map((trip, index) => (
        <div
          key={trip.id}
          className="animate-fade-in-up"
          style={{ animationDelay: `${Math.min(index * 40, 300)}ms` }}
        >
          <PortfolioTripCard
            trip={trip}
            href={publicTripRoute(slug, trip.id)}
            tilt={index % 2 === 0 ? 'left' : 'right'}
          />
        </div>
      ))}
    </div>
  )
}
