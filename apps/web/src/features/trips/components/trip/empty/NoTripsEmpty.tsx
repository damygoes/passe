'use client'

import { useTranslations } from 'next-intl'
import { buttonVariants } from '@passe/ui/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@passe/ui/empty'
import { Link } from '@/i18n/navigation'
import { routes } from '@/lib/routes'

export function NoTripsEmpty() {
  const t = useTranslations('trips.empty')

  return (
    <Empty className="mt-16 mx-auto w-fit border">
      <EmptyHeader>
        <EmptyTitle>{t('no_trips_title')}</EmptyTitle>
        <EmptyDescription>{t('no_trips_description')}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Link href={routes.tripsNew} className={buttonVariants({ size: 'sm' })}>
          {t('create_first_trip')}
        </Link>
      </EmptyContent>
    </Empty>
  )
}
