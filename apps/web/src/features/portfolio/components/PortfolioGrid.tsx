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
      {trips.map((trip) => (
        <PortfolioTripCard key={trip.id} trip={trip} href={publicTripRoute(slug, trip.id)} />
      ))}
    </div>
  )
}
