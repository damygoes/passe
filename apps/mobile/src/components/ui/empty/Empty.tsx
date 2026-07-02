import { useTheme } from '@/hooks/useTheme'
import { Text, View } from 'react-native'
import type {
  EmptyMediaProps,
  EmptyProps,
  EmptyTextSubProps,
  EmptyViewSubProps,
} from './Empty.types'

export function Empty({ style, children, ...props }: EmptyProps) {
  const { spacing, borderRadius, colors } = useTheme()

  return (
    <View
      style={[
        {
          width: '100%',
          alignItems: 'center',
          borderRadius: borderRadius.xl,
          borderWidth: 1,
          borderColor: colors.border,
          borderStyle: 'dashed',
          padding: spacing[6],
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  )
}

export function EmptyHeader({ style, children, ...props }: EmptyViewSubProps) {
  const { spacing } = useTheme()

  return (
    <View style={[{ alignItems: 'center', maxWidth: 320, gap: spacing[2] }, style]} {...props}>
      {children}
    </View>
  )
}

export function EmptyMedia({ variant = 'default', style, children, ...props }: EmptyMediaProps) {
  const { colors, borderRadius, spacing } = useTheme()

  const iconStyle =
    variant === 'icon'
      ? {
          width: 32,
          height: 32,
          borderRadius: borderRadius.lg,
          backgroundColor: colors.muted,
          alignItems: 'center' as const,
          justifyContent: 'center' as const,
          padding: spacing[1],
        }
      : {}

  return (
    <View style={[iconStyle, style]} {...props}>
      {children}
    </View>
  )
}

export function EmptyTitle({ style, children, ...props }: EmptyTextSubProps) {
  const { colors, fontSizes, fontWeights } = useTheme()

  return (
    <Text
      style={[{ fontSize: fontSizes.sm, fontWeight: fontWeights.medium, color: colors.foreground }, style]}
      {...props}
    >
      {children}
    </Text>
  )
}

export function EmptyDescription({ style, children, ...props }: EmptyTextSubProps) {
  const { colors, fontSizes } = useTheme()

  return (
    <Text
      style={[{ fontSize: fontSizes.sm, color: colors.mutedForeground, textAlign: 'center' }, style]}
      {...props}
    >
      {children}
    </Text>
  )
}

export function EmptyContent({ style, children, ...props }: EmptyViewSubProps) {
  const { spacing } = useTheme()

  return (
    <View
      style={[{ maxWidth: 320, alignItems: 'center', gap: spacing[2], marginTop: spacing[2] }, style]}
      {...props}
    >
      {children}
    </View>
  )
}
