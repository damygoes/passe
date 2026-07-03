import { useRouter } from 'expo-router'

import { Button } from '@/components/ui/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { useTranslations } from '@/i18n/useTranslations'

export function NoTripsEmpty() {
  const t = useTranslations('trips.empty')
  const router = useRouter()

  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>{t('no_trips_title')}</EmptyTitle>
        <EmptyDescription>{t('no_trips_description')}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onPress={() => router.push('/(app)/trips/new')}>{t('create_first_trip')}</Button>
      </EmptyContent>
    </Empty>
  )
}
