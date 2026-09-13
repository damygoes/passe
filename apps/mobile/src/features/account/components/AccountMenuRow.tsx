import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'

import { Icon } from '@/components/ui/icon'
import type { IconName } from '@/components/ui/icon'
import { useTheme } from '@/hooks/useTheme'

interface AccountMenuRowProps {
  icon: IconName
  label: string
  destructive?: boolean
  trailingIcon?: IconName
  /** Rendered between the label and the trailing chevron — e.g. a plan Badge. */
  trailing?: ReactNode
  onPress: () => void
}

export function AccountMenuRow({
  icon,
  label,
  destructive = false,
  trailingIcon = 'chevron-right',
  trailing,
  onPress,
}: AccountMenuRowProps) {
  const { colors, spacing, borderRadius, fontSizes, fontWeights } = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        row: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing[3],
          paddingHorizontal: spacing[4],
          paddingVertical: spacing[4],
          borderRadius: borderRadius.lg,
        },
        rowPressed: { backgroundColor: colors.muted },
        label: {
          flex: 1,
          fontSize: fontSizes.base,
          fontWeight: fontWeights.medium,
          color: colors.foreground,
        },
        labelDestructive: { color: colors.destructive },
      }),
    [colors, spacing, borderRadius, fontSizes, fontWeights],
  )

  const tint = destructive ? colors.destructive : colors.mutedForeground

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      <Icon name={icon} size="md" color={tint} />
      <Text style={[styles.label, destructive && styles.labelDestructive]}>{label}</Text>
      {trailing}
      <Icon name={trailingIcon} size="sm" color={colors.mutedForeground} />
    </Pressable>
  )
}
