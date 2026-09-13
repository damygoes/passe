import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { useTranslations } from '@/i18n/useTranslations'

export function NoPublicMemoriesEmpty() {
  const t = useTranslations('trips.public_trip')

  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>{t('empty_title')}</EmptyTitle>
        <EmptyDescription>{t('empty_description')}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
