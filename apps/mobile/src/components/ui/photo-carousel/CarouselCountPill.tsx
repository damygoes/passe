import { Text, View } from 'react-native'

import { Icon } from '@/components/ui/icon'
import { useTheme } from '@/hooks/useTheme'
import { createPhotoCarouselRecipe } from '@/recipes/photo-carousel'

interface CarouselCountPillProps {
  label: string
}

// A plain dark scrim (not GlassSurface) — this sits over a photo and needs
// to read as a fixed dark pill regardless of the viewer's light/dark theme,
// which GlassSurface's theme-aware fallback surface wouldn't guarantee.
export function CarouselCountPill({ label }: CarouselCountPillProps) {
  const theme = useTheme()
  const recipe = createPhotoCarouselRecipe(theme)

  return (
    <View style={recipe.countPill.container}>
      <Icon name="photo-stack" size="sm" color={theme.palette.agedCream.DEFAULT} />
      <Text style={recipe.countPill.label}>{label}</Text>
    </View>
  )
}
