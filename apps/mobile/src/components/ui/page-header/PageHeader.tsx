import { useTheme } from '@/hooks/useTheme'
import { Text, View } from 'react-native'
import type {
  PageHeaderProps,
  PageHeaderTextSubProps,
  PageHeaderViewSubProps,
} from './PageHeader.types'

export function PageHeader({ style, children, ...props }: PageHeaderProps) {
  const { spacing } = useTheme()

  return (
    <View
      style={[{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing[2] }, style]}
      {...props}
    >
      {children}
    </View>
  )
}

export function PageHeaderTitle({ style, children, ...props }: PageHeaderTextSubProps) {
  const { colors, fonts, fontSizes, fontWeights } = useTheme()

  return (
    <Text
      style={[
        {
          fontFamily: fonts.display,
          fontSize: fontSizes['2xl'],
          fontWeight: fontWeights.semibold,
          color: colors.foreground,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  )
}

export function PageHeaderDescription({ style, children, ...props }: PageHeaderTextSubProps) {
  const { colors, fontSizes } = useTheme()

  return (
    <Text style={[{ fontSize: fontSizes.sm, color: colors.mutedForeground }, style]} {...props}>
      {children}
    </Text>
  )
}

export function PageHeaderAction({ style, children, ...props }: PageHeaderViewSubProps) {
  return (
    <View style={[{ marginLeft: 'auto' }, style]} {...props}>
      {children}
    </View>
  )
}
