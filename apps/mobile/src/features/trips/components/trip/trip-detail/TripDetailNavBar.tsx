import { colors as brandColors } from '@passe/theme'
import { router } from 'expo-router'
import { useMemo } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Icon } from '@/components/ui/icon'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'
import { TripActionsHeaderButton } from './TripActionsHeaderButton'

const BUTTON_SIZE = 40

/** Height of the bar's content band, below the safe-area inset */
export const TRIP_DETAIL_NAV_BAR_HEIGHT = BUTTON_SIZE

// The trip detail screen opts out of the native stack header entirely: on
// iOS 26 devices, react-native-screens shifts the screen's content frame below
// a transparent header once the header reports its height, clipping the
// full-bleed hero no matter how far it is pulled up (the simulator keeps the
// frame edge-to-edge, which hid the bug). This floating bar replaces the nav
// bar's back/actions buttons, positioned off the safe-area inset instead.
export function TripDetailNavBar() {
  const { spacing } = useTheme()
  const t = useTranslations('trips.detail')
  const insets = useSafeAreaInsets()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        bar: {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          paddingTop: insets.top,
          paddingHorizontal: spacing[4],
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        },
      }),
    [insets.top, spacing],
  )

  return (
    <View style={styles.bar} pointerEvents="box-none">
      <Pressable
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel={t('back_label')}
        hitSlop={8}
        style={staticStyles.button}
      >
        <View style={staticStyles.scrim} />
        <Icon name="chevron-left" size="lg" color={brandColors.agedCream.DEFAULT} />
      </Pressable>
      <TripActionsHeaderButton />
    </View>
  )
}

// A plain dark scrim (not GlassSurface) — these buttons sit over a photo and
// need to read regardless of the viewer's light/dark theme or whether real
// Liquid Glass is available on the device, same rationale as CarouselCountPill.
const staticStyles = StyleSheet.create({
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
