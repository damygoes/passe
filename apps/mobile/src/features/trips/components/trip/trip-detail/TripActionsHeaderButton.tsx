import { colors as brandColors } from '@passe/theme'
import { router, useGlobalSearchParams } from 'expo-router'
import { Pressable, StyleSheet, View } from 'react-native'

import { Icon } from '@/components/ui/icon'
import { useTranslations } from '@/i18n/useTranslations'

const BUTTON_SIZE = 40

// Rendered inside TripDetailNavBar on the trips/[id] screen, so the trip id
// comes from the global search params, not props.
// A plain dark scrim (not GlassSurface) — this sits over a photo and needs
// to read regardless of the viewer's light/dark theme or whether real Liquid
// Glass is available on the device, same rationale as CarouselCountPill.
export function TripActionsHeaderButton() {
  const t = useTranslations('trips.detail')
  const { id } = useGlobalSearchParams<{ id: string }>()

  if (!id) return null

  return (
    <Pressable
      onPress={() => router.push(`/(app)/trips/actions/${id}`)}
      accessibilityLabel={t('actions_label')}
      hitSlop={8}
      style={styles.button}
    >
      <View style={styles.scrim} />
      <Icon name="more" size="lg" color={brandColors.agedCream.DEFAULT} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: `${brandColors.darkEspresso.DEFAULT}8C`,
  },
})
