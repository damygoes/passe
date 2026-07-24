'use client'

import { CountUp } from '@/components/motion/CountUp'
import { SECTION_STEP, STAGGER_INTERVAL } from '@/lib/motion'
import { Card, CardContent } from '@passe/ui/card'
import { Icon, type IconName } from '@passe/ui/icon'
import { cn } from '@passe/utils'
import { useTranslations } from 'next-intl'
import { useRef } from 'react'
import { PersonalStatsStickyBar } from '../stats/PersonalStatsStickyBar'

interface Props {
  countriesCount: number
  citiesCount: number
  yearsCount: number
}

export function PersonalStats({ countriesCount, citiesCount, yearsCount }: Props) {
  const t = useTranslations('trips.stats')
  const gridRef = useRef<HTMLDivElement>(null)

  const stats: { icon: IconName; count: number; label: string }[] = [
    { icon: 'globe', count: countriesCount, label: t('countries', { count: countriesCount }) },
    { icon: 'location', count: citiesCount, label: t('cities', { count: citiesCount }) },
    { icon: 'calendar', count: yearsCount, label: t('years', { count: yearsCount }) },
  ]

  return (
    <>
      <div
        ref={gridRef}
        className="grid w-full grid-cols-3 gap-3 sm:gap-4 scrapbook:flex scrapbook:flex-wrap scrapbook:justify-center scrapbook:gap-4 sm:scrapbook:justify-start"
      >
        {stats.map((stat, index) => (
          <div key={stat.icon} className="scrapbook:hidden">
            <Card size="sm" className="rounded-lg">
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
          </div>
        ))}
        {/* Scrapbook theme's own stat style — a passport/postmark stamp
            instead of a plain card, matching the country-badge motif. Fixed
            diameter (not aspect-square/w-full) so it stays a restrained
            accent; the container switches to flex/flex-wrap under scrapbook
            (see gridRef div above) so these sit close together as a cluster
            instead of spread across the trip grid's 3 equal-width columns.
            Text uses fixed brand colors since the stamp's paper face is
            always aged-cream regardless of app dark/light mode. */}
        {stats.map((stat, index) => (
          <div
            key={`${stat.icon}-stamp`}
            className={cn(
              'hidden scrapbook:flex h-24 w-24 sm:h-28 sm:w-28 flex-col items-center justify-center gap-0.5 shrink-0',
              'rounded-full border-[3.5px] border-dashed border-terracotta-dark/50 bg-aged-cream',
              'shadow-[0_6px_16px_rgba(44,26,14,0.14)]',
              index % 2 === 0 ? 'scrapbook:-rotate-2' : 'scrapbook:rotate-2',
            )}
          >
            <Icon name={stat.icon} size="md" className="text-primary" aria-hidden />
            <CountUp
              value={stat.count}
              delay={SECTION_STEP + index * STAGGER_INTERVAL}
              className="font-display text-xl font-bold text-dark-espresso"
            />
            <p className="font-annotation text-base leading-none text-muted-taupe">{stat.label}</p>
          </div>
        ))}
      </div>
      <PersonalStatsStickyBar
        sentinelRef={gridRef}
        countriesCount={countriesCount}
        citiesCount={citiesCount}
        yearsCount={yearsCount}
      />
    </>
  )
}
