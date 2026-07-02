import { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { Icon } from '@/components/ui/icon'
import { useTheme } from '@/hooks/useTheme'
import { PASSWORD_RULES } from '@/features/auth/schemas/auth'

interface PasswordStrengthMeterProps {
  password: string
}

const STRENGTH_LEVELS = [
  { key: 'weak', label: 'Weak', bars: 1 },
  { key: 'fair', label: 'Fair', bars: 2 },
  { key: 'good', label: 'Good', bars: 3 },
  { key: 'strong', label: 'Strong', bars: 4 },
  { key: 'very_strong', label: 'Very strong', bars: 4 },
] as const

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const { colors, palette, spacing, fontSizes, fontWeights } = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrapper: { gap: spacing[2] },
        barRow: { flexDirection: 'row', alignItems: 'center', gap: spacing[3] },
        bars: { flex: 1, flexDirection: 'row', gap: spacing[1] },
        bar: { flex: 1, height: 4, borderRadius: 999 },
        label: { width: 96, textAlign: 'right', fontSize: fontSizes.xs, fontWeight: fontWeights.medium },
        rulesList: { gap: spacing[1] },
        ruleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing[1] },
        ruleText: { fontSize: fontSizes.xs },
      }),
    [spacing, fontSizes, fontWeights],
  )

  if (!password) return null

  const results = PASSWORD_RULES.map((rule) => rule.test(password))
  const score = results.filter(Boolean).length

  if (score === 0) return null

  const level = STRENGTH_LEVELS[score - 1]!
  const barColors = [
    colors.destructive,
    palette.terracotta.DEFAULT,
    palette.terracotta.light,
    palette.deepOlive.light,
    palette.deepOlive.DEFAULT,
  ]
  const textColors = [
    colors.destructive,
    palette.terracotta.DEFAULT,
    palette.terracotta.DEFAULT,
    palette.deepOlive.DEFAULT,
    palette.deepOlive.dark,
  ]
  const activeColor = barColors[score - 1]!
  const activeTextColor = textColors[score - 1]!

  return (
    <View style={styles.wrapper}>
      <View style={styles.barRow}>
        <View style={styles.bars}>
          {Array.from({ length: 4 }, (_, i) => (
            <View
              key={i}
              style={[styles.bar, { backgroundColor: i < level.bars ? activeColor : colors.border }]}
            />
          ))}
        </View>
        <Text style={[styles.label, { color: activeTextColor }]}>{level.label}</Text>
      </View>

      <View style={styles.rulesList}>
        {PASSWORD_RULES.map((rule, i) => {
          const passed = results[i]!
          const ruleColor = passed ? palette.deepOlive.DEFAULT : colors.mutedForeground
          return (
            <View key={rule.id} style={styles.ruleRow}>
              <Icon name={passed ? 'check' : 'close'} size="xs" color={ruleColor} />
              <Text style={[styles.ruleText, { color: ruleColor }]}>{rule.label}</Text>
            </View>
          )
        })}
      </View>
    </View>
  )
}
