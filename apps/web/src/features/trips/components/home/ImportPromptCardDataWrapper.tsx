'use client'

import { Link } from '@/i18n/navigation'
import { tripNewMemoryRoute } from '@/lib/routes'
import { useTrips } from '@passe/hooks'
import { buttonVariants } from '@passe/ui/button'
import { Skeleton } from '@passe/ui/skeleton'
import { cn, getMostRecentTrip } from '@passe/utils'
import { useTranslations } from 'next-intl'

export function ImportPromptCardDataWrapper() {
  const t = useTranslations('trips.home')
  const { data: trips = [], isLoading, isError } = useTrips()

  if (isLoading) return <Skeleton className="h-40 w-full rounded-[28px]" />
  if (isError) return null

  // Nothing to add a memory *to* yet — NoTripsEmpty (shown in place of the
  // continue-trip card) already covers this state with its own CTA.
  const mostRecentTrip = getMostRecentTrip(trips)
  if (!mostRecentTrip) return null
  const href = tripNewMemoryRoute(mostRecentTrip.id)

  return (
    <div className="rounded-[28px] bg-dark-espresso-dark p-6 text-aged-cream">
      <h3 className="font-display text-2xl leading-snug">{t('import_title')}</h3>
      <p className="mt-2 text-[13.5px] text-aged-cream/80">{t('import_body')}</p>
      <Link
        href={href}
        className={cn(
          buttonVariants(),
          'mt-3.5 bg-aged-cream text-dark-espresso-dark hover:bg-aged-cream/90',
        )}
      >
        {t('import_cta', { title: mostRecentTrip.title })}
      </Link>
    </div>
  )
}
