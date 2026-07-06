import type { MapPoint } from '@passe/types/memory'
import { Image } from 'expo-image'
import { useMemo } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'

interface MapMemoryCardProps {
  point: MapPoint
  onViewTrip: () => void
  onClose: () => void
}

export function MapMemoryCard({ point, onViewTrip, onClose }: MapMemoryCardProps) {
  const t = useTranslations('map')
  const { colors, spacing, fontSizes, borderRadius } = useTheme()

  const location = [point.city, point.country].filter(Boolean).join(', ')

  const styles = useMemo(
    () =>
      StyleSheet.create({
        cardShadow: {
          borderRadius: borderRadius.xl,
          backgroundColor: colors.popover,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.16,
          shadowRadius: 12,
          elevation: 4,
        },
        cardSurface: { borderWidth: 0, backgroundColor: colors.popover },
        thumbnail: { width: '100%', aspectRatio: 16 / 9 },
        closeButton: {
          position: 'absolute',
          top: spacing[2],
          right: spacing[2],
          zIndex: 1,
          backgroundColor: colors.popover,
          borderRadius: borderRadius.full,
          padding: spacing[1],
        },
        note: { fontSize: fontSizes.sm, color: colors.foreground },
        content: { gap: spacing[1] },
        footer: { justifyContent: 'flex-end' },
      }),
    [colors, spacing, fontSizes, borderRadius],
  )

  return (
    <View style={styles.cardShadow}>
      <Card style={styles.cardSurface}>
        {point.thumbnailUrl && (
          <Image source={{ uri: point.thumbnailUrl }} style={styles.thumbnail} contentFit="cover" />
        )}
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel={t('close')}
          style={styles.closeButton}
        >
          <Icon name="close" size="sm" color={colors.foreground} />
        </Pressable>
        <CardContent style={styles.content}>
          {location.length > 0 && <CardDescription>{location}</CardDescription>}
          {point.note && (
            <Text style={styles.note} numberOfLines={3}>
              {point.note}
            </Text>
          )}
        </CardContent>
        <CardFooter style={styles.footer}>
          <Button variant="primary" size="sm" onPress={onViewTrip}>
            {t('view_trip')}
          </Button>
        </CardFooter>
      </Card>
    </View>
  )
}
