'use client'

import { useAllMemories, useTrips, useUser } from '@passe/hooks'
import { Skeleton } from '@passe/ui/skeleton'
import { StatTile } from '@passe/ui/stat-tile'
import { formatWeekdayDate, getUniqueCities, getUniqueStatsFromTrips } from '@passe/utils'
import { useTranslations } from 'next-intl'

function greetingKey(hour: number): 'greeting_morning' | 'greeting_afternoon' | 'greeting_evening' {
  if (hour < 12) return 'greeting_morning'
  if (hour < 18) return 'greeting_afternoon'
  return 'greeting_evening'
}

export function HomeHeaderDataWrapper() {
  const t = useTranslations('trips.home')
  const tStats = useTranslations('trips.stats')
  const { data: user, isLoading: userLoading } = useUser()
  const { data: trips = [], isLoading: tripsLoading, isError: tripsError } = useTrips()
  const {
    data: allMemories = [],
    isLoading: memoriesLoading,
    isError: memoriesError,
  } = useAllMemories()

  if (userLoading || tripsLoading || memoriesLoading) {
    return (
      <div className="flex flex-wrap items-end justify-between gap-6">
        <Skeleton className="h-16 w-64" />
        <Skeleton className="h-11 w-72" />
      </div>
    )
  }

  const firstName = user?.displayName?.split(' ')[0] ?? ''
  const { uniqueCountries } = getUniqueStatsFromTrips({ trips })
  const { uniqueCities } = getUniqueCities({ allMemories })

  return (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <div>
        <div className="font-mono text-[10.5px] tracking-[0.14em] text-muted-foreground uppercase">
          {formatWeekdayDate(new Date())}
        </div>
        <h1 className="font-display mt-2 text-4xl leading-tight sm:text-5xl">
          {t(greetingKey(new Date().getHours()), { name: firstName })}
        </h1>
        <p className="font-display mt-2 text-xl text-terracotta-dark italic dark:text-terracotta-light">
          {t('accent_line')}
        </p>
      </div>
      {!tripsError && !memoriesError && (
        <div className="flex gap-8">
          <StatTile
            align="end"
            size="lg"
            value={uniqueCities.size}
            label={tStats('cities', { count: uniqueCities.size })}
          />
          <StatTile
            align="end"
            size="lg"
            value={uniqueCountries.size}
            label={tStats('countries', { count: uniqueCountries.size })}
          />
          <StatTile
            align="end"
            size="lg"
            value={trips.length}
            label={tStats('trips_label', { count: trips.length })}
          />
        </div>
      )}
    </div>
  )
}
