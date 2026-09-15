import { getPublicMemorySlots } from '@passe/auth/plan-gates'
import { useMemories, useTrip, useUpdateMemory, useUser } from '@passe/hooks'
import { colors as brandColors } from '@passe/theme'
import type { CreateMemoryMedia, Memory } from '@passe/types/memory'
import type { Trip } from '@passe/types/trip'
import { formatCoordinates, formatMemoryDateTime } from '@passe/utils'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useMemo, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { GlassSurface } from '@/components/ui/glass-surface'
import { Icon } from '@/components/ui/icon'
import { PhotoCarousel, ThumbnailStrip } from '@/components/ui/photo-carousel'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { ErrorBanner } from '@/features/account/components/ErrorBanner'
import { ThisPhotographSection } from '@/features/trips/components/memories/ThisPhotographSection'
import { useAddMemoryPhotos } from '@/features/trips/components/memories/useAddMemoryPhotos'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'

const PHOTO_HEIGHT = 430
const BACK_BUTTON_SIZE = 40

function toCreateMemoryMedia(photo: Memory['media'][number]): CreateMemoryMedia {
  return {
    url: photo.url,
    mediaType: photo.mediaType,
    width: photo.width,
    height: photo.height,
    caption: photo.caption,
    capturedAt: photo.capturedAt,
  }
}

export function MemoryDetailScreen() {
  const { id, tripId } = useLocalSearchParams<{ id: string; tripId: string }>()
  const t = useTranslations('trips.memory_card')
  const insets = useSafeAreaInsets()
  const { colors, spacing } = useTheme()
  const { data: trip } = useTrip(tripId)
  const { data: memories = [], isLoading, isError } = useMemories(tripId)
  const { data: user } = useUser()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        safeArea: { flex: 1, backgroundColor: colors.background },
        content: { padding: spacing[6], paddingBottom: spacing[8] },
        skeletonPhoto: { width: '100%', height: PHOTO_HEIGHT, borderRadius: 0 },
      }),
    [colors, spacing],
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

  const otherPublicCount = memories.filter((item) => item.id !== memory.id && item.isPublic).length
  const slots = user ? getPublicMemorySlots(user.plan, otherPublicCount) : null

  return (
    <MemoryDetailContent
      tripId={tripId}
      memoryId={id}
      trip={trip}
      memory={memory}
      slots={slots}
      insetsTop={insets.top}
    />
  )
}

interface ContentProps {
  tripId: string
  memoryId: string
  trip: Trip | undefined
  memory: Memory
  slots: ReturnType<typeof getPublicMemorySlots> | null
  insetsTop: number
}

// Owns selection state and every per-photo mutation. Split out from
// MemoryDetailScreen so every hook here (including useAddMemoryPhotos,
// which needs a guaranteed Memory) is called unconditionally on every
// render — the parent's loading/error guards run before this mounts.
function MemoryDetailContent({ tripId, memoryId, trip, memory, slots, insetsTop }: ContentProps) {
  const t = useTranslations('trips.memory_card')
  const tDetail = useTranslations('trips.memory_detail')
  const router = useRouter()
  const { colors, fonts, spacing, fontSizes, borderRadius } = useTheme()
  const updateMemory = useUpdateMemory()
  const [selectedIndex, setSelectedIndex] = useState(0)
  // Reset selection during render (not in an effect) when navigating to a
  // different memory — the documented alternative to useEffect for
  // adjusting state in response to a prop change.
  const [resetKey, setResetKey] = useState(memoryId)
  if (memoryId !== resetKey) {
    setResetKey(memoryId)
    setSelectedIndex(0)
  }

  const { pickFromLibrary, error: uploadError } = useAddMemoryPhotos({
    tripId,
    memory,
    onAdded: (firstNewIndex) => setSelectedIndex(firstNewIndex),
  })

  const media = memory.media
  const clampedIndex = media.length > 0 ? Math.min(selectedIndex, media.length - 1) : 0
  const activePhoto = media[clampedIndex]
  const canPublish =
    memory.isPublic || (slots ? !slots.isUnlimited && (slots.remaining ?? 0) > 0 : true)
  const placeLabel = memory.placeName ?? [memory.city, memory.country].filter(Boolean).join(', ')

  const styles = useMemo(
    () =>
      StyleSheet.create({
        safeArea: { flex: 1, backgroundColor: colors.background },
        backButton: {
          position: 'absolute',
          top: insetsTop + spacing[2],
          left: spacing[4],
          width: BACK_BUTTON_SIZE,
          height: BACK_BUTTON_SIZE,
          borderRadius: BACK_BUTTON_SIZE / 2,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          zIndex: 1,
        },
        photoWrapper: { marginTop: -insetsTop },
        emptyPhoto: {
          width: '100%',
          height: PHOTO_HEIGHT + insetsTop,
          marginTop: -insetsTop,
          backgroundColor: brandColors.darkEspresso.dark,
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing[2],
        },
        emptyLabel: {
          fontFamily: fonts.mono,
          fontSize: 10.5,
          letterSpacing: 1.4,
          textTransform: 'uppercase',
          color: `${brandColors.agedCream.DEFAULT}BF`,
        },
        captionRow: {
          flexDirection: 'row',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: spacing[4],
          paddingHorizontal: spacing[6] + 2,
          paddingTop: spacing[3],
        },
        caption: { flex: 1, fontSize: 13, color: colors.mutedForeground },
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
        photographSection: {
          marginTop: spacing[5],
          borderRadius: borderRadius.lg + spacing[1],
          backgroundColor: colors.popover,
          padding: spacing[4],
        },
        photographLabel: {
          fontFamily: fonts.mono,
          fontSize: 10,
          letterSpacing: 1.2,
          textTransform: 'uppercase',
          color: colors.mutedForeground,
        },
        errorText: { fontSize: fontSizes.xs, color: colors.destructive, marginTop: spacing[2] },
        actions: { flexDirection: 'row', gap: spacing[2] + 2, marginTop: spacing[6] },
        actionButton: { flex: 1 },
      }),
    [colors, fonts, spacing, fontSizes, borderRadius, insetsTop],
  )

  function selectPhoto(index: number) {
    if (media.length === 0) return
    setSelectedIndex(((index % media.length) + media.length) % media.length)
  }

  function setCover(index: number) {
    if (index === 0) return
    const reordered = [media[index]!, ...media.filter((_, i) => i !== index)]
    updateMemory.mutate({ tripId, id: memory.id, media: reordered.map(toCreateMemoryMedia) })
    setSelectedIndex(0)
  }

  function saveCaption(index: number, caption: string) {
    const next = media.map((item, i) =>
      i === index ? { ...item, caption: caption || null } : item,
    )
    updateMemory.mutate({ tripId, id: memory.id, media: next.map(toCreateMemoryMedia) })
  }

  function deletePhoto(index: number) {
    const next = media.filter((_, i) => i !== index)
    updateMemory.mutate({ tripId, id: memory.id, media: next.map(toCreateMemoryMedia) })
    setSelectedIndex((current) => Math.min(current, Math.max(next.length - 1, 0)))
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView>
        {activePhoto ? (
          <View style={styles.photoWrapper}>
            <PhotoCarousel
              photos={media}
              selectedIndex={clampedIndex}
              onIndexChange={selectPhoto}
              height={PHOTO_HEIGHT + insetsTop}
              topInset={insetsTop}
              countLabel={tDetail('photo_position_short', {
                current: clampedIndex + 1,
                total: media.length,
              })}
              prevLabel={tDetail('prev_photo')}
              nextLabel={tDetail('next_photo')}
            />
          </View>
        ) : (
          <Pressable
            style={styles.emptyPhoto}
            onPress={pickFromLibrary}
            accessibilityRole="button"
            accessibilityLabel={tDetail('add_photographs')}
          >
            <Icon name="photo-stack" size="xl" color={`${brandColors.agedCream.DEFAULT}D9`} />
            <Text style={styles.emptyLabel}>{tDetail('empty_gallery_prompt')}</Text>
          </Pressable>
        )}

        {media.length > 1 && (
          <ThumbnailStrip
            photos={media}
            selectedIndex={clampedIndex}
            onSelect={selectPhoto}
            onAddPhotos={pickFromLibrary}
            addLabel={tDetail('add_tile_label')}
          />
        )}

        {activePhoto?.caption && (
          <View style={styles.captionRow}>
            <Text style={styles.caption} numberOfLines={2}>
              {activePhoto.caption}
            </Text>
          </View>
        )}

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

          {activePhoto && (
            <View style={styles.photographSection}>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: spacing[3] }}>
                <Text style={styles.photographLabel}>{tDetail('this_photograph')}</Text>
                {media.length > 1 && (
                  <Text style={styles.photographLabel}>
                    {tDetail('photo_position_short', {
                      current: clampedIndex + 1,
                      total: media.length,
                    })}
                  </Text>
                )}
              </View>
              <ThisPhotographSection
                caption={activePhoto.caption ?? null}
                isCover={clampedIndex === 0}
                isPending={updateMemory.isPending}
                onSetCover={() => setCover(clampedIndex)}
                onSaveCaption={(caption) => saveCaption(clampedIndex, caption)}
                onDelete={() => deletePhoto(clampedIndex)}
              />
            </View>
          )}

          {uploadError && <Text style={styles.errorText}>{uploadError}</Text>}

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
        <Icon name="chevron-left" size="lg" color={colors.foreground} />
      </Pressable>
    </SafeAreaView>
  )
}
