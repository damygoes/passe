import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect'

import { useTheme } from '@/hooks/useTheme'
import { createGlassSurfaceRecipe } from '@/recipes/glass-surface'
import type { GlassSurfaceProps } from './GlassSurface.types'

// Liquid Glass availability is a device/OS capability — it can't change while the app is
// running, so this only needs to be resolved once rather than per render.
const glassSupported = isLiquidGlassAvailable()

export function GlassSurface({
  variant = 'regular',
  shape = 'rounded',
  tint,
  isInteractive = false,
  style,
  children,
  ...props
}: GlassSurfaceProps) {
  const theme = useTheme()
  const recipe = createGlassSurfaceRecipe(theme)

  return (
    <GlassView
      glassEffectStyle={variant}
      tintColor={tint}
      isInteractive={isInteractive}
      style={[recipe.shapes[shape], !glassSupported && recipe.fallback, style]}
      {...props}
    >
      {children}
    </GlassView>
  )
}
