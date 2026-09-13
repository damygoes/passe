import { Stack } from 'expo-router'
import { StyleSheet } from 'react-native'

import { GlassSurface } from '@/components/ui/glass-surface'
import { useTheme } from '@/hooks/useTheme'
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

// Short action sheets (trip actions, export options) size to their content
// instead of the near-full-height form detent.
const compactSheetOptions = {
  ...sheetOptions,
  sheetAllowedDetents: 'fitToContents' as const,
}

export default function TripsLayout() {
  const tTrips = useTranslations('trips.new')
  const tEdit = useTranslations('trips.edit')
  const tMemory = useTranslations('trips.new_memory')
  const tEditMemory = useTranslations('trips.edit_memory')
  const tDetail = useTranslations('trips.detail')
  const { colors } = useTheme()

  return (
    <Stack
      screenOptions={{
        headerTransparent: true,
        headerShadowVisible: false,
        headerBackground: () => <GlassSurface shape="none" style={StyleSheet.absoluteFill} />,
        headerTintColor: colors.foreground,
        headerTitleStyle: { color: colors.foreground },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="[id]"
        options={{
          // No native header: on iOS 26 devices react-native-screens clips
          // content bleeding under a transparent header (the content frame is
          // shifted below it). The screen renders TripDetailNavBar — floating
          // back/actions buttons over the hero — instead.
          headerShown: false,
        }}
      />
      <Stack.Screen name="actions/[id]" options={compactSheetOptions} />
      <Stack.Screen name="export/[id]" options={compactSheetOptions} />
      <Stack.Screen name="new" options={{ ...sheetOptions, title: tTrips('title') }} />
      <Stack.Screen name="edit/[id]" options={{ ...sheetOptions, title: tEdit('title') }} />
      <Stack.Screen name="new-memory/[id]" options={{ ...sheetOptions, title: tMemory('title') }} />
      <Stack.Screen
        name="edit-memory/[id]"
        options={{ ...sheetOptions, title: tEditMemory('title') }}
      />
      <Stack.Screen
        name="export-zine/[id]"
        options={{ ...sheetOptions, title: tDetail('zine_picker_title') }}
      />
      <Stack.Screen
        name="export-postcard/[id]"
        options={{ ...sheetOptions, title: tDetail('postcard_picker_title') }}
      />
    </Stack>
  )
}
