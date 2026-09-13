import { useLocalSearchParams, useRouter } from 'expo-router'

import { AccountFormLayout } from '@/features/account/components/AccountFormLayout'
import { MemoryForm } from '@/features/trips/components/memories/MemoryForm'
import { useTranslations } from '@/i18n/useTranslations'

export function AddMemoryScreen() {
  const { id: tripId } = useLocalSearchParams<{ id: string }>()
  const t = useTranslations('trips.new_memory')
  const router = useRouter()

  // Always the trip this memory was being added to — router.back() can land
  // somewhere unexpected if this screen was reached other than by a normal
  // push (e.g. a stale/replayed navigation stack), so target it explicitly.
  function goToTrip() {
    router.replace(`/(app)/trips/${tripId}`)
  }

  return (
    <AccountFormLayout title={t('title')} description={t('subtitle')} onClose={goToTrip}>
      <MemoryForm tripId={tripId} onCancel={goToTrip} />
    </AccountFormLayout>
  )
}
