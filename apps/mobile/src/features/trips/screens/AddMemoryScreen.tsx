import { useLocalSearchParams } from 'expo-router'

import { AccountFormLayout } from '@/features/account/components/AccountFormLayout'
import { MemoryForm } from '@/features/trips/components/memories/MemoryForm'
import { useTranslations } from '@/i18n/useTranslations'

export function AddMemoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const t = useTranslations('trips.new_memory')

  return (
    <AccountFormLayout title={t('title')} description={t('subtitle')}>
      <MemoryForm tripId={id} />
    </AccountFormLayout>
  )
}
