import { publicPortfolioRoute } from '@/lib/routes'
import { Logo } from '@passe/ui/logo'
import { formatTripDate } from '@passe/utils'

interface UserData {
  username: string
}

interface TripData {
  title: string
  startDate: Date | string
  countries: string[]
}

interface Props {
  user: UserData
  trip: TripData
  cities: string[]
  daysCount: number
  sharedMemoriesCount: number
  totalMemoriesCount: number
}

export function PortfolioTripHeader({
  user,
  trip,
  cities,
  daysCount,
  sharedMemoriesCount,
  totalMemoriesCount,
}: Props) {
  const hasPrivateMemories = totalMemoriesCount > sharedMemoriesCount
  const place = cities.length > 0 ? cities.join(', ') : trip.countries.join(', ')

  return (
    <div>
      <header className="flex items-center justify-between border-b px-6 py-5 sm:px-14">
        <a href={publicPortfolioRoute(user.username)} className="block">
          <Logo className="h-5 w-auto" />
        </a>
        <span className="font-mono text-[10.5px] tracking-[0.1em] text-muted-foreground uppercase">
          passe.cc/u/{user.username}/trips
        </span>
      </header>

      <div className="mx-auto max-w-[900px] px-6 pt-20 sm:px-14">
        <p className="font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
          {[formatTripDate(trip.startDate).toUpperCase(), place].filter(Boolean).join(' · ')}
        </p>
        <h1 className="font-display mt-4 text-[56px] leading-[0.98] tracking-[-0.03em] sm:text-[92px]">
          {trip.title}
        </h1>
        <p className="mt-[22px] max-w-[620px] text-[16px] leading-relaxed text-muted-foreground sm:text-[18px]">
          {daysCount > 0 ? `${daysCount} days` : 'A trip'} across{' '}
          {trip.countries.join(', ') || 'the map'}.{' '}
          {hasPrivateMemories
            ? `${sharedMemoriesCount} of ${totalMemoriesCount} memories are shared here — the rest stay where they belong.`
            : 'Every memory from this trip is shared here.'}
        </p>
      </div>
    </div>
  )
}
