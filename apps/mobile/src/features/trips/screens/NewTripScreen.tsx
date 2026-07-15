import { AccountFormLayout } from '@/features/account/components/AccountFormLayout'
import { TripForm } from '@/features/trips/components/trip/forms/TripForm'
import { useTranslations } from '@/i18n/useTranslations'

export function NewTripScreen() {
  const t = useTranslations('trips.new')

  return (
    <AccountFormLayout title={t('title')} description={t('subtitle')}>
      <TripForm />
    </AccountFormLayout>
  )
}
