import type { MapPoint } from '@passe/types/memory'
import { Image } from 'expo-image'
import { useMemo } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'

interface MapMemoryCardPager {
  index: number
  total: number
  onPrev: () => void
  onNext: () => void
}

interface MapMemoryCardProps {
  point: MapPoint
  onViewTrip: () => void
  onClose: () => void
  pager?: MapMemoryCardPager
}

export function MapMemoryCard({ point, onViewTrip, onClose, pager }: MapMemoryCardProps) {
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
        footer: { justifyContent: pager ? 'space-between' : 'flex-end' },
        pager: { flexDirection: 'row', alignItems: 'center', gap: spacing[1] },
        pagerText: { fontSize: fontSizes.sm, color: colors.mutedForeground },
        pagerButton: { padding: spacing[1] },
      }),
    [colors, spacing, fontSizes, borderRadius, pager],
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
          {pager && (
            <View style={styles.pager}>
              <Pressable
                onPress={pager.onPrev}
                disabled={pager.index === 0}
                accessibilityRole="button"
                style={styles.pagerButton}
              >
                <Icon
                  name="chevron-left"
                  size="sm"
                  color={pager.index === 0 ? colors.mutedForeground : colors.foreground}
                />
              </Pressable>
              <Text style={styles.pagerText}>
                {pager.index + 1} / {pager.total}
              </Text>
              <Pressable
                onPress={pager.onNext}
                disabled={pager.index === pager.total - 1}
                accessibilityRole="button"
                style={styles.pagerButton}
              >
                <Icon
                  name="chevron-right"
                  size="sm"
                  color={pager.index === pager.total - 1 ? colors.mutedForeground : colors.foreground}
                />
              </Pressable>
            </View>
          )}
          <Button variant="primary" size="sm" onPress={onViewTrip}>
            {t('view_trip')}
          </Button>
        </CardFooter>
      </Card>
    </View>
  )
}
