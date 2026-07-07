'use client'

import { CountUp } from '@/components/motion/CountUp'
import { SECTION_STEP, STAGGER_INTERVAL } from '@/lib/motion'
import { Card, CardContent } from '@passe/ui/card'
import { Icon, type IconName } from '@passe/ui/icon'
import { useTranslations } from 'next-intl'
import { useRef } from 'react'
import { TripStatsStickyBar } from '../stats/TripStatsStickyBar'

interface Props {
  countriesCount: number
  citiesCount: number
  yearsCount: number
}

export function TripStats({ countriesCount, citiesCount, yearsCount }: Props) {
  const t = useTranslations('trips.stats')
  const gridRef = useRef<HTMLDivElement>(null)

  const stats: { icon: IconName; count: number; label: string }[] = [
    { icon: 'globe', count: countriesCount, label: t('countries', { count: countriesCount }) },
    { icon: 'location', count: citiesCount, label: t('cities', { count: citiesCount }) },
    { icon: 'calendar', count: yearsCount, label: t('years', { count: yearsCount }) },
  ]

  return (
    <>
      <div ref={gridRef} className="grid w-full grid-cols-3 gap-3 sm:gap-4">
        {stats.map((stat, index) => (
          <Card key={stat.icon} size="sm" className="rounded-lg">
            <CardContent className="flex flex-col gap-1">
              <Icon name={stat.icon} size="md" className="text-primary" aria-hidden />
              <CountUp
                value={stat.count}
                delay={SECTION_STEP + index * STAGGER_INTERVAL}
                className="text-2xl font-semibold"
              />
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <TripStatsStickyBar
        sentinelRef={gridRef}
        countriesCount={countriesCount}
        citiesCount={citiesCount}
        yearsCount={yearsCount}
      />
    </>
  )
}
