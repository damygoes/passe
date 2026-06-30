'use client'

import { useTranslations } from 'next-intl'
import { buttonVariants } from '@passe/ui/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@passe/ui/empty'

export function NoMemoriesEmpty() {
  const t = useTranslations('trips.empty')

  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyTitle>{t('no_memories_title')}</EmptyTitle>
        <EmptyDescription>{t('no_memories_description')}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <button className={buttonVariants({ size: 'sm' })}>{t('add_first_memory')}</button>
      </EmptyContent>
    </Empty>
  )
}
