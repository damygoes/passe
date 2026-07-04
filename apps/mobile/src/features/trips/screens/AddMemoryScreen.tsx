import { useLocalSearchParams } from 'expo-router'

import { AccountFormLayout } from '@/features/account/components/AccountFormLayout'
import { AddMemoryForm } from '@/features/trips/components/AddMemoryForm'
import { useTranslations } from '@/i18n/useTranslations'

export function AddMemoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const t = useTranslations('trips.new_memory')

  return (
    <AccountFormLayout title={t('title')} description={t('subtitle')}>
      <AddMemoryForm tripId={id} />
    </AccountFormLayout>
  )
}
