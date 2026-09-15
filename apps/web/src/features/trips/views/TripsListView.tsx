'use client'

import { FadeIn } from '@/components/motion/FadeIn'
import { Link } from '@/i18n/navigation'
import { routes } from '@/lib/routes'
import { buttonVariants } from '@passe/ui/button'
import { Segmented, SegmentedItem } from '@passe/ui/segmented'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { TripsList, type TripsFilter } from '../components/trip/lists/TripsList'

export function TripsListView() {
  const t = useTranslations('trips.list')
  const [filter, setFilter] = useState<TripsFilter>('all')

  return (
    <div className="container mx-auto flex w-full flex-col gap-8 px-4 py-8">
      <FadeIn className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <h1 className="font-display text-4xl sm:text-5xl">{t('title')}</h1>
          <Segmented value={filter} onValueChange={(value) => setFilter(value as TripsFilter)}>
            <SegmentedItem value="all">{t('filter_all')}</SegmentedItem>
            <SegmentedItem value="private">{t('filter_private')}</SegmentedItem>
            <SegmentedItem value="shared">{t('filter_shared')}</SegmentedItem>
          </Segmented>
        </div>
        <Link href={routes.tripsNew} className={buttonVariants({ size: 'sm' })}>
          {t('new_trip')}
        </Link>
      </FadeIn>
      <TripsList filter={filter} />
    </div>
  )
}
