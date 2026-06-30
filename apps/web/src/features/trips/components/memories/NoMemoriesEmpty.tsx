'use client'

import { useTranslations } from 'next-intl'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@passe/ui/empty'

export function NoMemoriesEmpty() {
  const t = useTranslations('trips.empty')

  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyTitle>{t('no_memories_title')}</EmptyTitle>
        <EmptyDescription>{t('no_memories_description')}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
