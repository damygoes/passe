import { usePasseApi, useMemories } from '@passe/hooks'
import { Image } from 'expo-image'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useMemo, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { AccountFormLayout } from '@/features/account/components/AccountFormLayout'
import { ErrorBanner } from '@/features/account/components/ErrorBanner'
import {
  ShareUnavailableError,
  downloadTripExport,
} from '@/features/trips/utils/downloadTripExport'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'
import { haptics } from '@/lib/haptics'

// Mirrors ZineSelectionSchema (@passe/types) — the zine template has exactly 6 memory panels
const ZINE_SELECTION_COUNT = 6

export function ZineExportScreen() {
  const t = useTranslations('trips.detail')
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const { data: memories = [], isLoading, isError } = useMemories(id)
  const { baseUrl, getToken } = usePasseApi()
  const { colors, spacing, fontSizes, borderRadius } = useTheme()
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generateError, setGenerateError] = useState<string | null>(null)

  const memoriesWithPhotos = memories.filter((memory) => memory.media.length > 0)

  const styles = useMemo(
    () =>
      StyleSheet.create({
        grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] },
        tile: {
          width: '31%',
          aspectRatio: 1,
          borderRadius: borderRadius.lg,
          overflow: 'hidden',
          borderWidth: 2,
          borderColor: 'transparent',
          backgroundColor: colors.muted,
        },
        tileSelected: { borderColor: colors.primary },
        tileImage: { width: '100%', height: '100%' },
        orderBadge: {
          position: 'absolute',
          top: spacing[1],
          right: spacing[1],
          width: 20,
          height: 20,
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.primary,
        },
        orderBadgeLabel: {
          fontSize: fontSizes.xs,
          color: colors.primaryForeground,
        },
        skeletonTile: { width: '31%', aspectRatio: 1 },
        emptyText: { fontSize: fontSizes.sm, color: colors.mutedForeground },
        footer: { gap: spacing[3] },
        countText: { fontSize: fontSizes.sm, color: colors.mutedForeground },
        footerButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: spacing[2] },
      }),
    [colors, spacing, fontSizes, borderRadius],
  )

  function toggleSelection(memoryId: string) {
    haptics.selection()
    setSelectedIds((current) => {
      if (current.includes(memoryId)) return current.filter((selected) => selected !== memoryId)
      if (current.length >= ZINE_SELECTION_COUNT) return current
      return [...current, memoryId]
    })
  }

  async function handleGenerate() {
    setGenerateError(null)
    setIsGenerating(true)
    try {
      await downloadTripExport({
        path: `/api/trips/${id}/zine`,
        method: 'POST',
        body: { memoryIds: selectedIds },
        fallbackFilename: 'zine.pdf',
        baseUrl,
        getToken,
      })
      router.back()
    } catch (err) {
      setGenerateError(
        err instanceof ShareUnavailableError
          ? t('export_share_unavailable')
          : t('zine_generate_failed'),
      )
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <AccountFormLayout
      title={t('zine_picker_title')}
      description={t('zine_picker_description', { count: ZINE_SELECTION_COUNT })}
    >
      {isLoading && (
        <View style={styles.grid}>
          {Array.from({ length: ZINE_SELECTION_COUNT }).map((_, index) => (
            <Skeleton key={index} style={styles.skeletonTile} />
          ))}
        </View>
      )}

      {!isLoading && isError && <ErrorBanner message={t('zine_memories_error')} />}

      {!isLoading && !isError && memoriesWithPhotos.length === 0 && (
        <Text style={styles.emptyText}>{t('zine_no_photos')}</Text>
      )}

      {!isLoading && !isError && memoriesWithPhotos.length > 0 && (
        <View style={styles.grid}>
          {memoriesWithPhotos.map((memory) => {
            const cover = memory.media[0]
            const selectedPosition = selectedIds.indexOf(memory.id)
            const isSelected = selectedPosition !== -1
            const isDisabled = !isSelected && selectedIds.length >= ZINE_SELECTION_COUNT

            return (
              <Pressable
                key={memory.id}
                disabled={isDisabled || isGenerating}
                onPress={() => toggleSelection(memory.id)}
                style={[styles.tile, isSelected && styles.tileSelected]}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected, disabled: isDisabled }}
              >
                {cover && (
                  <Image source={{ uri: cover.url }} style={styles.tileImage} contentFit="cover" />
                )}
                {isSelected && (
                  <View style={styles.orderBadge}>
                    <Text style={styles.orderBadgeLabel}>{selectedPosition + 1}</Text>
                  </View>
                )}
              </Pressable>
            )
          })}
        </View>
      )}

      {generateError && <ErrorBanner message={generateError} />}

      <View style={styles.footer}>
        <Text style={styles.countText}>
          {t('zine_selection_count', { count: selectedIds.length, max: ZINE_SELECTION_COUNT })}
        </Text>
        <View style={styles.footerButtons}>
          <Button variant="secondary" size="sm" onPress={() => router.back()}>
            {t('zine_cancel')}
          </Button>
          <Button
            size="sm"
            disabled={selectedIds.length !== ZINE_SELECTION_COUNT || isGenerating}
            loading={isGenerating}
            onPress={handleGenerate}
          >
            {t('zine_generate')}
          </Button>
        </View>
      </View>
    </AccountFormLayout>
  )
}
