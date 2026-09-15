'use client'

import { useAllMemories, useTrips } from '@passe/hooks'
import { Skeleton } from '@passe/ui/skeleton'
import { StatTile } from '@passe/ui/stat-tile'
import {
  formatLongDate,
  formatMonthName,
  getPersonalStatsFacts,
  getUniqueCities,
  getUniqueStatsFromTrips,
} from '@passe/utils'
import { useTranslations } from 'next-intl'
import { NoTripsEmpty } from '../trip/empty/NoTripsEmpty'

export function StatsGridDataWrapper() {
  const t = useTranslations('trips.stats_screen')
  const { data: trips = [], isLoading: tripsLoading, isError: tripsError } = useTrips()
  const {
    data: memories = [],
    isLoading: memoriesLoading,
    isError: memoriesError,
  } = useAllMemories()

  if (tripsLoading || memoriesLoading) {
    return (
      <div className="flex flex-col gap-9">
        <Skeleton className="h-14 w-96" />
        <Skeleton className="h-[220px] w-full rounded-[28px]" />
        <div className="grid grid-cols-2 gap-5">
          <Skeleton className="h-32 rounded-[28px]" />
          <Skeleton className="h-32 rounded-[28px]" />
        </div>
      </div>
    )
  }

  if (tripsError || memoriesError) {
    return <p className="text-sm text-destructive">{t('load_error')}</p>
  }

  if (trips.length === 0) {
    return <NoTripsEmpty />
  }

  const { uniqueCountries, uniqueYears } = getUniqueStatsFromTrips({ trips })
  const { uniqueCities } = getUniqueCities({ allMemories: memories })
  const facts = getPersonalStatsFacts({ trips, memories })
  const firstYear = [...uniqueYears].sort((a, b) => a - b)[0]

  const cells: { value: number; label: string; note?: string }[] = [
    {
      value: uniqueCountries.size,
      label: t('countries', { count: uniqueCountries.size }),
      note: facts.mostRecentCountry
        ? t('countries_note', { country: facts.mostRecentCountry })
        : undefined,
    },
    {
      value: uniqueCities.size,
      label: t('cities', { count: uniqueCities.size }),
      note:
        facts.repeatCitiesCount > 0
          ? t('cities_note_repeat', { count: facts.repeatCitiesCount })
          : t('cities_note_none'),
    },
    {
      value: facts.tripsCount,
      label: t('trips_label', { count: facts.tripsCount }),
      note: facts.firstTripTitle ? t('trips_note', { title: facts.firstTripTitle }) : undefined,
    },
    {
      value: facts.memoriesCount,
      label: t('memories', { count: facts.memoriesCount }),
      note:
        facts.privateMemoriesCount > 0
          ? t('memories_note_private', { count: facts.privateMemoriesCount })
          : t('memories_note_none'),
    },
    {
      value: facts.daysAwayCount,
      label: t('days_away', { count: facts.daysAwayCount }),
      note: t('days_away_note'),
    },
    {
      value: uniqueYears.size,
      label: t('years', { count: uniqueYears.size }),
      note: firstYear ? t('years_note', { year: firstYear }) : undefined,
    },
  ]

  return (
    <div className="flex flex-col gap-9">
      <div>
        <h1 className="font-display text-4xl sm:text-5xl">{t('title')}</h1>
        <p className="font-display mt-2.5 text-xl text-terracotta-dark italic sm:text-[22px] dark:text-terracotta-light">
          {t('subhead', {
            cities: uniqueCities.size,
            countries: uniqueCountries.size,
            years: uniqueYears.size,
          })}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-[28px] bg-border sm:grid-cols-3">
        {cells.map((cell) => (
          <StatTile
            key={cell.label}
            tone="surface"
            size="xl"
            value={cell.value}
            label={cell.label}
            note={cell.note}
            className="rounded-none"
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="rounded-[28px] bg-secondary p-7">
          <h2 className="font-display text-2xl">{t('furthest_title')}</h2>
          <p className="mt-2.5 text-[14.5px] leading-relaxed text-foreground/75">
            {facts.furthestMemory
              ? t('furthest_body', {
                  city: facts.furthestMemory.city ?? t('somewhere'),
                  country: facts.furthestMemory.country ?? '',
                  distance: facts.furthestMemory.distanceKm,
                  date: formatLongDate(facts.furthestMemory.capturedAt),
                })
              : t('furthest_body_empty')}
          </p>
        </div>
        <div className="rounded-[28px] bg-popover p-7 shadow-sm">
          <h2 className="font-display text-2xl">{t('quietest_title')}</h2>
          <p className="mt-2.5 text-[14.5px] leading-relaxed text-muted-foreground">
            {facts.quietestMonth
              ? facts.quietestMonth.count === 0
                ? t('quietest_body_zero', {
                    month: formatMonthName(facts.quietestMonth.monthIndex),
                  })
                : t('quietest_body', {
                    month: formatMonthName(facts.quietestMonth.monthIndex),
                    count: facts.quietestMonth.count,
                  })
              : t('quietest_body_empty')}
          </p>
        </div>
      </div>
    </div>
  )
}
