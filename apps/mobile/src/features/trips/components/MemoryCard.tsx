import { useUpdateMemory } from '@passe/hooks'
import { Image } from 'expo-image'
import { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'

interface MemoryCardData {
  id: string
  tripId: string
  isPublic: boolean
  note?: string | null
  media: { id: string; url: string }[]
  city?: string | null
  country?: string | null
}

interface MemoryCardProps {
  memory: MemoryCardData
}

export function MemoryCard({ memory }: MemoryCardProps) {
  const t = useTranslations('trips.memory_card')
  const updateMemory = useUpdateMemory()
  const { colors, spacing, fontSizes } = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        photoWrapper: { width: '100%' },
        photo: { width: '100%', aspectRatio: 16 / 9 },
        photoCountBadge: {
          position: 'absolute',
          right: spacing[2],
          bottom: spacing[2],
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing[1],
          borderRadius: 999,
          paddingHorizontal: spacing[2],
          paddingVertical: spacing[1],
          backgroundColor: colors.background,
        },
        photoCountText: { fontSize: fontSizes.xs, color: colors.foreground },
        note: { fontSize: fontSizes.sm, color: colors.foreground },
        footer: { justifyContent: 'flex-end' },
        toggleContent: { flexDirection: 'row', alignItems: 'center', gap: spacing[1] },
        toggleLabel: { fontSize: fontSizes.xs, color: colors.mutedForeground },
      }),
    [colors, spacing, fontSizes],
  )

  function handleTogglePublic() {
    updateMemory.mutate({ id: memory.id, tripId: memory.tripId, isPublic: !memory.isPublic })
  }

  return (
    <Card>
      {memory.media.length > 0 && (
        <View style={styles.photoWrapper}>
          <Image
            source={{ uri: memory.media[0]!.url }}
            style={styles.photo}
            contentFit="cover"
            accessibilityLabel={t('photo_alt')}
          />
          {memory.media.length > 1 && (
            <View style={styles.photoCountBadge}>
              <Icon name="camera" size="xs" color={colors.foreground} />
              <Text style={styles.photoCountText}>
                {t('photo_count', { count: memory.media.length })}
              </Text>
            </View>
          )}
        </View>
      )}
      {(memory.city || memory.country) && (
        <CardHeader>
          <CardDescription>
            {[memory.city, memory.country].filter(Boolean).join(', ')}
          </CardDescription>
        </CardHeader>
      )}
      {memory.note && (
        <CardContent>
          <Text style={styles.note}>{memory.note}</Text>
        </CardContent>
      )}
      <CardFooter style={styles.footer}>
        <Button
          variant="ghost"
          size="sm"
          loading={updateMemory.isPending}
          onPress={handleTogglePublic}
          accessibilityLabel={memory.isPublic ? t('make_private') : t('make_public')}
        >
          <View style={styles.toggleContent}>
            <Icon
              name={memory.isPublic ? 'eye' : 'eye-off'}
              size="sm"
              color={colors.mutedForeground}
            />
            <Text style={styles.toggleLabel}>
              {memory.isPublic ? t('public_label') : t('private_label')}
            </Text>
          </View>
        </Button>
      </CardFooter>
    </Card>
  )
}
