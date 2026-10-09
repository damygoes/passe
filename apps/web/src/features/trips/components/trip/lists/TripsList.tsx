'use client'

import { Stagger, StaggerItem } from '@/components/motion/Stagger'
import { Link } from '@/i18n/navigation'
import { billingRoute, tripRoute } from '@/lib/routes'
import { useAllMemories, useTrips, useUser } from '@passe/hooks'
import { getTripSlots } from '@passe/auth/plan-gates'
import { buttonVariants } from '@passe/ui/button'
import { getUniqueCities } from '@passe/utils'
import { useTranslations } from 'next-intl'
import { TripCard } from '../card/TripCard'
import { NoTripsEmpty } from '../empty/NoTripsEmpty'
import { TripsListSkeleton } from './TripsListSkeleton'

export type TripsFilter = 'all' | 'private' | 'shared'

interface Props {
  filter: TripsFilter
}

export function TripsList({ filter }: Props) {
  const t = useTranslations('trips.list')
  const { data: trips = [], isLoading: tripsLoading, isError: tripsError } = useTrips()
  const {
    data: allMemories = [],
    isLoading: memoriesLoading,
    isError: memoriesError,
  } = useAllMemories()
  const { data: user } = useUser()

  if (tripsLoading || memoriesLoading) {
    return <TripsListSkeleton />
  }

  if (tripsError || memoriesError) {
    return <p className="text-sm text-destructive">{t('trips_error')}</p>
  }

  if (trips.length === 0) {
    return <NoTripsEmpty />
  }

  const tripsWithDerived = trips.map((trip) => {
    const tripMemories = allMemories.filter((memory) => memory.tripId === trip.id)
    const { uniqueCities } = getUniqueCities({ allMemories: tripMemories })
    return { trip, cities: [...uniqueCities], isShared: tripMemories.some((m) => m.isPublic) }
  })

  const filtered = tripsWithDerived.filter(({ isShared }) => {
    if (filter === 'private') return !isShared
    if (filter === 'shared') return isShared
    return true
  })

  const slots = user ? getTripSlots(user.plan, trips.length) : null

  return (
    <div className="flex flex-col gap-6">
      <Stagger className="grid w-full grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(({ trip, cities, isShared }) => (
          <StaggerItem key={trip.id}>
            <TripCard trip={trip} cities={cities} isShared={isShared} href={tripRoute(trip.id)} />
          </StaggerItem>
        ))}
      </Stagger>
      {slots && !slots.isUnlimited && (
        <div className="flex items-center gap-4 rounded-3xl bg-secondary p-5">
          <div className="flex-1">
            <div className="font-mono text-[10.5px] tracking-[0.12em] text-secondary-foreground uppercase">
              {/* Guarded by `!slots.isUnlimited` above, so `limit` is always a number here. */}
              {t('quota_label', { count: slots.used, limit: slots.limit ?? 0 })}
            </div>
            <div className="mt-2.5 h-[5px] overflow-hidden rounded-full bg-dark-espresso/15">
              <div
                className="h-full rounded-full bg-terracotta"
                style={{
                  width: `${Math.min(100, (slots.used / (slots.limit ?? 1)) * 100)}%`,
                }}
              />
            </div>
          </div>
          <Link href={billingRoute('trips')} className={buttonVariants({ size: 'sm' })}>
            {t('quota_cta')}
          </Link>
        </div>
      )}
    </div>
  )
}
