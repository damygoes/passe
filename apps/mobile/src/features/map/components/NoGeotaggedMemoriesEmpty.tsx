import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { useTranslations } from '@/i18n/useTranslations'

export function NoGeotaggedMemoriesEmpty() {
  const t = useTranslations('map.empty')

  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>{t('title')}</EmptyTitle>
        <EmptyDescription>{t('description')}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
