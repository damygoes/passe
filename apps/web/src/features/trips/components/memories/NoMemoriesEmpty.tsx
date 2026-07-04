'use client'

import { buttonVariants } from '@passe/ui/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@passe/ui/empty'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { tripNewMemoryRoute } from '@/lib/routes'

interface Props {
  tripId: string
}

export function NoMemoriesEmpty({ tripId }: Props) {
  const t = useTranslations('trips.empty')

  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyTitle>{t('no_memories_title')}</EmptyTitle>
        <EmptyDescription>{t('no_memories_description')}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Link href={tripNewMemoryRoute(tripId)} className={buttonVariants({ size: 'sm' })}>
          {t('add_first_memory')}
        </Link>
      </EmptyContent>
    </Empty>
  )
}
