'use client'

import { useTranslations } from 'next-intl'

interface Props {
  countriesCount: number
  citiesCount: number
  yearsCount: number
}

export function TripStats({ countriesCount, citiesCount, yearsCount }: Props) {
  const t = useTranslations('trips.stats')

  return (
    <div className="flex w-full gap-8 border-y py-4">
      <div>
        <p className="text-2xl font-semibold">{countriesCount}</p>
        <p className="text-sm text-muted-foreground">{t('countries', { count: countriesCount })}</p>
      </div>
      <div>
        <p className="text-2xl font-semibold">{citiesCount}</p>
        <p className="text-sm text-muted-foreground">{t('cities', { count: citiesCount })}</p>
      </div>
      <div>
        <p className="text-2xl font-semibold">{yearsCount}</p>
        <p className="text-sm text-muted-foreground">{t('years', { count: yearsCount })}</p>
      </div>
    </div>
  )
}
