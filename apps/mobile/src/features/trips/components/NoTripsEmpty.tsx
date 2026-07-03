import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { useTranslations } from '@/i18n/useTranslations'

export function NoTripsEmpty() {
  const t = useTranslations('trips.empty')

  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>{t('no_trips_title')}</EmptyTitle>
        <EmptyDescription>{t('no_trips_description')}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
