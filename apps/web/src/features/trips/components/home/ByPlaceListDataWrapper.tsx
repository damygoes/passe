'use client'

import { Link } from '@/i18n/navigation'
import { routes } from '@/lib/routes'
import { useAllMemories } from '@passe/hooks'
import { buttonVariants } from '@passe/ui/button'
import { Skeleton } from '@passe/ui/skeleton'
import { getPlacesByCountry } from '@passe/utils'
import { useTranslations } from 'next-intl'

const VISIBLE_PLACES = 4

export function ByPlaceListDataWrapper() {
  const t = useTranslations('trips.home')
  const tStats = useTranslations('trips.stats')
  const { data: allMemories = [], isLoading, isError } = useAllMemories()

  if (isLoading) return <Skeleton className="h-64 w-full rounded-[28px]" />
  if (isError) return null

  const thisYear = new Date().getFullYear()
  const memoriesThisYear = allMemories.filter(
    (memory) => new Date(memory.capturedAt).getFullYear() === thisYear,
  )
  const places = getPlacesByCountry({ memories: memoriesThisYear })
  if (places.length === 0) return null

  const visible = places.slice(0, VISIBLE_PLACES)
  const remaining = places.length - visible.length

  return (
    <div className="flex-1 rounded-[28px] bg-popover p-6 shadow-sm">
      <div className="flex items-baseline justify-between">
        <div className="font-mono text-[10.5px] tracking-[0.14em] text-muted-foreground uppercase">
          {t('by_place_heading')}
        </div>
        <Link href={routes.map} className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
          {t('see_map')}
        </Link>
      </div>
      <ul>
        {visible.map((place) => (
          <li
            key={place.country}
            className="flex items-baseline justify-between border-b border-border py-2.5 last:border-0"
          >
            <span className="font-display text-xl">{place.country}</span>
            <span className="font-mono text-[11px] text-muted-foreground uppercase">
              {place.cityCount} {tStats('cities', { count: place.cityCount })}
            </span>
          </li>
        ))}
      </ul>
      {remaining > 0 && (
        <div className="pt-3 font-mono text-[11px] text-muted-foreground">
          {t('by_place_more', { count: remaining })}
        </div>
      )}
    </div>
  )
}
