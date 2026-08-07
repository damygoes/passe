import { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Animated from 'react-native-reanimated'

import { Icon } from '@/components/ui/icon'
import type { IconName } from '@/components/ui/icon'
import { useTheme } from '@/hooks/useTheme'
import { listStagger } from '@/lib/motion'

interface FeatureHighlight {
  icon: IconName
  label: string
}

interface FeatureHighlightListProps {
  features: FeatureHighlight[]
}

export function FeatureHighlightList({ features }: FeatureHighlightListProps) {
  const { colors, spacing, fontSizes, borderRadius } = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        list: { gap: spacing[3] },
        row: { flexDirection: 'row', alignItems: 'center', gap: spacing[3] },
        iconWrap: {
          width: spacing[10],
          height: spacing[10],
          borderRadius: borderRadius.full,
          backgroundColor: `${colors.primary}1A`,
          alignItems: 'center',
          justifyContent: 'center',
        },
        label: { flex: 1, fontSize: fontSizes.base, color: colors.foreground },
      }),
    [colors, spacing, fontSizes, borderRadius],
  )

  return (
    <View style={styles.list}>
      {features.map((feature, index) => (
        <Animated.View key={feature.label} entering={listStagger(index)} style={styles.row}>
          <View style={styles.iconWrap}>
            <Icon name={feature.icon} size="md" color={colors.primary} />
          </View>
          <Text style={styles.label}>{feature.label}</Text>
        </Animated.View>
      ))}
    </View>
  )
}
