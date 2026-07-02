import { HugeiconsIcon } from '@hugeicons/react-native'
import { iconMap } from '@passe/ui/icon-map'
import { useTheme } from '@/hooks/useTheme'
import type { IconProps, IconSize } from './Icon.types'

const sizeMap: Record<IconSize, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 56,
}

const strokeWidthMap: Record<IconSize, number> = {
  xs: 1.5,
  sm: 1.5,
  md: 1.5,
  lg: 1.5,
  xl: 1.5,
  '2xl': 1.5,
  '3xl': 2,
  '4xl': 2,
  '5xl': 2,
}

export function Icon({ name, size = 'md', color, strokeWidth, style }: IconProps) {
  const { colors } = useTheme()
  const icon = iconMap[name]
  const px = sizeMap[size]
  const sw = strokeWidth ?? strokeWidthMap[size]
  const iconColor = color ?? colors.foreground

  return (
    <HugeiconsIcon
      icon={icon}
      size={px}
      color={iconColor}
      strokeWidth={sw}
      style={style}
    />
  )
}
