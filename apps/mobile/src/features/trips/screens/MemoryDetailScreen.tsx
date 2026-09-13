import { getPublicMemorySlots } from '@passe/auth/plan-gates'
import { useMemories, useTrip, useUpdateMemory, useUser } from '@passe/hooks'
import { colors as brandColors } from '@passe/theme'
import { formatCoordinates, formatMemoryDateTime } from '@passe/utils'
import { Image } from 'expo-image'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useMemo } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ErrorBanner } from '@/features/account/components/ErrorBanner'
import { GlassSurface } from '@/components/ui/glass-surface'
import { Icon } from '@/components/ui/icon'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'

const PHOTO_HEIGHT = 430
const BACK_BUTTON_SIZE = 34

export function MemoryDetailScreen() {
  const { id, tripId } = useLocalSearchParams<{ id: string; tripId: string }>()
  const t = useTranslations('trips.memory_card')
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { colors, fonts, spacing, fontSizes, borderRadius } = useTheme()
  const { data: trip } = useTrip(tripId)
  const { data: memories = [], isLoading, isError } = useMemories(tripId)
  const { data: user } = useUser()
  const updateMemory = useUpdateMemory()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        safeArea: { flex: 1, backgroundColor: colors.background },
        backButton: {
          position: 'absolute',
          top: insets.top + spacing[2],
          left: spacing[4],
          width: BACK_BUTTON_SIZE,
          height: BACK_BUTTON_SIZE,
          borderRadius: BACK_BUTTON_SIZE / 2,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          zIndex: 1,
        },
        photo: {
          width: '100%',
          height: PHOTO_HEIGHT + insets.top,
          marginTop: -insets.top,
          backgroundColor: brandColors.darkEspresso.dark,
        },
        content: { padding: spacing[6], paddingBottom: spacing[8] },
        date: {
          fontFamily: fonts.mono,
          fontSize: 10.5,
          letterSpacing: 1.4,
          textTransform: 'uppercase',
          color: colors.mutedForeground,
        },
        title: {
          fontFamily: fonts.display,
          fontSize: fontSizes['3xl'],
          lineHeight: 34,
          color: colors.foreground,
          marginTop: spacing[2],
        },
        note: {
          fontSize: 15.5,
          lineHeight: 25,
          color: colors.foreground,
          marginTop: spacing[3] + 2,
        },
        card: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing[3],
          marginTop: spacing[5],
          borderRadius: borderRadius.lg + spacing[1],
          backgroundColor: colors.popover,
          padding: spacing[4],
        },
        dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
        cardTitle: { fontSize: 13.5, color: colors.foreground },
        cardMeta: {
          fontFamily: fonts.mono,
          fontSize: 10.5,
          color: colors.mutedForeground,
          marginTop: 2,
        },
        publishRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing[3],
          marginTop: spacing[3],
          borderRadius: borderRadius.lg + spacing[1],
          backgroundColor: colors.popover,
          padding: spacing[4],
        },
        publishText: { flex: 1 },
        tags: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2], marginTop: spacing[4] },
        actions: { flexDirection: 'row', gap: spacing[2] + 2, marginTop: spacing[6] },
        actionButton: { flex: 1 },
        skeletonPhoto: { width: '100%', height: PHOTO_HEIGHT, borderRadius: 0 },
      }),
    [colors, fonts, spacing, fontSizes, borderRadius, insets.top],
  )

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <ScrollView>
          <Skeleton style={styles.skeletonPhoto} />
          <View style={styles.content}>
            <Skeleton style={{ height: 12, width: 140 }} />
            <Skeleton style={{ height: 30, width: '70%', marginTop: spacing[3] }} />
            <Skeleton style={{ height: 60, width: '100%', marginTop: spacing[3] }} />
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }

  const memory = memories.find((item) => item.id === id)

  if (isError || !memory) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.content}>
          <ErrorBanner message={t('delete_failed')} />
        </View>
      </SafeAreaView>
    )
  }

  const cover = memory.media[0]
  const otherPublicCount = memories.filter((item) => item.id !== memory.id && item.isPublic).length
  const slots = user ? getPublicMemorySlots(user.plan, otherPublicCount) : null
  const canPublish =
    memory.isPublic || (slots ? !slots.isUnlimited && (slots.remaining ?? 0) > 0 : true)
  const placeLabel = memory.placeName ?? [memory.city, memory.country].filter(Boolean).join(', ')

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView>
        <View style={styles.photo}>
          {cover && (
            <Image
              source={{ uri: cover.url }}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              accessibilityLabel={t('photo_alt')}
            />
          )}
        </View>

        <View style={styles.content}>
          <Text style={styles.date}>{formatMemoryDateTime(memory.capturedAt)}</Text>
          {placeLabel ? <Text style={styles.title}>{placeLabel}</Text> : null}
          {memory.note ? <Text style={styles.note}>{memory.note}</Text> : null}

          {placeLabel ? (
            <View style={styles.card}>
              <View style={styles.dot} />
              <View>
                <Text style={styles.cardTitle}>{placeLabel}</Text>
                {memory.location && (
                  <Text style={styles.cardMeta}>
                    {formatCoordinates(memory.location.lat, memory.location.lng)}
                  </Text>
                )}
              </View>
            </View>
          ) : null}

          <View style={styles.publishRow}>
            <View style={styles.publishText}>
              <Text style={styles.cardTitle}>{t('visible_on_public_page')}</Text>
              {slots && (
                <Text style={styles.cardMeta}>
                  {slots.isUnlimited
                    ? t('public_slots_unlimited')
                    : t('public_slots_limited', {
                        remaining: slots.remaining ?? 0,
                        limit: slots.limit ?? 0,
                      })}
                </Text>
              )}
            </View>
            <Switch
              checked={memory.isPublic}
              disabled={!canPublish || updateMemory.isPending}
              onCheckedChange={(checked) =>
                updateMemory.mutate({ tripId, id: memory.id, isPublic: checked })
              }
              accessibilityLabel={memory.isPublic ? t('make_private') : t('make_public')}
            />
          </View>

          {memory.tags.length > 0 && (
            <View style={styles.tags}>
              {memory.tags.map((tag) => (
                <Badge key={tag} variant="neutral">
                  {tag}
                </Badge>
              ))}
            </View>
          )}

          <View style={styles.actions}>
            <Button
              variant="secondary"
              style={styles.actionButton}
              onPress={() => router.push(`/(app)/trips/export-postcard/${tripId}`)}
            >
              {t('make_postcard')}
            </Button>
            <Button
              variant="secondary"
              style={styles.actionButton}
              onPress={() => router.push(`/(app)/trips/edit-memory/${memory.id}?tripId=${tripId}`)}
            >
              {t('edit')}
            </Button>
          </View>
        </View>
      </ScrollView>

      <Pressable
        onPress={() => router.back()}
        style={styles.backButton}
        accessibilityRole="button"
        accessibilityLabel={t('back', { title: trip?.title ?? '' })}
        hitSlop={8}
      >
        <GlassSurface shape="circle" style={StyleSheet.absoluteFill} />
        <Icon name="chevron-left" size="md" color={colors.foreground} />
      </Pressable>
    </SafeAreaView>
  )
}
