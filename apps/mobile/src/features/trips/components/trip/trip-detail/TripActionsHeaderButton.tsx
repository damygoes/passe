import { router, useGlobalSearchParams } from 'expo-router'
import { Pressable, StyleSheet } from 'react-native'

import { GlassSurface } from '@/components/ui/glass-surface'
import { Icon } from '@/components/ui/icon'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'

const BUTTON_SIZE = 34

// Rendered as headerRight of the trips/[id] screen (registered in the trips
// _layout), so the trip id comes from the global search params, not props.
// The glass circle matches the system back button and keeps the icon legible
// both over the hero photo and over content once the hero scrolls away.
export function TripActionsHeaderButton() {
  const { colors } = useTheme()
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
      <GlassSurface shape="circle" style={StyleSheet.absoluteFill} />
      <Icon name="more" size="md" color={colors.foreground} />
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
})
