'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { buttonVariants } from '@passe/ui/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@passe/ui/empty'

interface Props {
  locale: string
}

export function NoTripsEmpty({ locale }: Props) {
  const t = useTranslations('trips.empty')

  return (
    <Empty className="mt-16 mx-auto w-fit border">
      <EmptyHeader>
        <EmptyTitle>{t('no_trips_title')}</EmptyTitle>
        <EmptyDescription>{t('no_trips_description')}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Link href={`/${locale}/trips/new`} className={buttonVariants({ size: 'sm' })}>
          {t('create_first_trip')}
        </Link>
      </EmptyContent>
    </Empty>
  )
}
