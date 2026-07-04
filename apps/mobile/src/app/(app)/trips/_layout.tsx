import { Stack } from 'expo-router'

import { NewTripHeaderButton } from '@/features/trips/components/NewTripHeaderButton'
import { useTranslations } from '@/i18n/useTranslations'

// Native headers are not rendered inside formSheet presentations, so the new-trip
// screen renders its own title via AccountFormLayout
const sheetOptions = {
  presentation: 'formSheet' as const,
  headerShown: false,
  sheetGrabberVisible: true,
  sheetAllowedDetents: [0.98],
  sheetCornerRadius: 24,
}

export default function TripsLayout() {
  const t = useTranslations('nav')
  const tTrips = useTranslations('trips.new')
  const tEdit = useTranslations('trips.edit')

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: t('trips'), headerRight: () => <NewTripHeaderButton /> }}
      />
      <Stack.Screen name="[id]" options={{ title: '', headerBackButtonDisplayMode: 'minimal' }} />
      <Stack.Screen name="new" options={{ ...sheetOptions, title: tTrips('title') }} />
      <Stack.Screen name="edit/[id]" options={{ ...sheetOptions, title: tEdit('title') }} />
    </Stack>
  )
}
