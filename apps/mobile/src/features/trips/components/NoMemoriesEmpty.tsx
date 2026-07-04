import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { useTranslations } from '@/i18n/useTranslations'

export function NoMemoriesEmpty() {
  const t = useTranslations('trips.empty')

  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>{t('no_memories_title')}</EmptyTitle>
        <EmptyDescription>{t('no_memories_description')}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
