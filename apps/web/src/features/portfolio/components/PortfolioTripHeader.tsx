import { publicPortfolioRoute } from '@/lib/routes'

interface UserData {
  displayName: string
}

interface TripData {
  title: string
  description?: string | null
  countries: string[]
}

interface Props {
  slug: string
  user: UserData
  trip: TripData
}

export function PortfolioTripHeader({ slug, user, trip }: Props) {
  return (
    <header className="border-b px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <a
          href={publicPortfolioRoute(slug)}
          className="mb-6 inline-block text-xs text-muted-foreground underline-offset-4 hover:underline"
        >
          ← {user.displayName}&apos;s portfolio
        </a>
        <h1 className="font-heading text-3xl font-semibold">{trip.title}</h1>
        {trip.description && <p className="mt-2 text-muted-foreground">{trip.description}</p>}
        {trip.countries.length > 0 && (
          <p className="mt-3 text-sm text-muted-foreground">{trip.countries.join(' · ')}</p>
        )}
      </div>
    </header>
  )
}
