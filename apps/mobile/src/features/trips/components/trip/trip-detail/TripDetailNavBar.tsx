import { router } from 'expo-router'
import { useMemo } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { GlassSurface } from '@/components/ui/glass-surface'
import { Icon } from '@/components/ui/icon'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'
import { TripActionsHeaderButton } from './TripActionsHeaderButton'

const BUTTON_SIZE = 34

/** Height of the bar's content band, below the safe-area inset */
export const TRIP_DETAIL_NAV_BAR_HEIGHT = BUTTON_SIZE

// The trip detail screen opts out of the native stack header entirely: on
// iOS 26 devices, react-native-screens shifts the screen's content frame below
// a transparent header once the header reports its height, clipping the
// full-bleed hero no matter how far it is pulled up (the simulator keeps the
// frame edge-to-edge, which hid the bug). This floating bar replaces the nav
// bar's back/actions buttons, positioned off the safe-area inset instead.
export function TripDetailNavBar() {
  const { colors, spacing } = useTheme()
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
        <GlassSurface shape="circle" style={StyleSheet.absoluteFill} />
        <Icon name="chevron-left" size="md" color={colors.foreground} />
      </Pressable>
      <TripActionsHeaderButton />
    </View>
  )
}

const staticStyles = StyleSheet.create({
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
