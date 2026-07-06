'use client'

import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@passe/ui/empty'
import { useTranslations } from 'next-intl'

export function NoGeotaggedMemoriesEmpty() {
  const t = useTranslations('map.empty')

  return (
    <Empty className="mt-16 mx-auto w-fit border">
      <EmptyHeader>
        <EmptyTitle>{t('title')}</EmptyTitle>
        <EmptyDescription>{t('description')}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
