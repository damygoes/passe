import { usePasseApi, useMemories } from '@passe/hooks'
import { Image } from 'expo-image'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useMemo, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { AccountFormLayout } from '@/features/account/components/AccountFormLayout'
import { ErrorBanner } from '@/features/account/components/ErrorBanner'
import {
  ShareUnavailableError,
  downloadTripExport,
} from '@/features/trips/utils/downloadTripExport'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'
import { haptics } from '@/lib/haptics'

// Mirrors PostcardSelectionSchema (@passe/types)
const POSTCARD_MESSAGE_MAX_LENGTH = 280

export function PostcardExportScreen() {
  const t = useTranslations('trips.detail')
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const { data: memories = [], isLoading, isError } = useMemories(id)
  const { baseUrl, getToken } = usePasseApi()
  const { colors, spacing, fontSizes, borderRadius } = useTheme()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [message, setMessage] = useState('')
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
        skeletonTile: { width: '31%', aspectRatio: 1 },
        emptyText: { fontSize: fontSizes.sm, color: colors.mutedForeground },
        footerButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: spacing[2] },
      }),
    [colors, spacing, fontSizes, borderRadius],
  )

  function selectMemory(memoryId: string) {
    haptics.selection()
    setSelectedId(memoryId)
  }

  async function handleGenerate() {
    if (!selectedId) return
    setGenerateError(null)
    setIsGenerating(true)
    try {
      await downloadTripExport({
        path: `/api/trips/${id}/postcard`,
        method: 'POST',
        body: { memoryId: selectedId, message: message.trim() || undefined },
        fallbackFilename: 'postcard.pdf',
        baseUrl,
        getToken,
      })
      router.back()
    } catch (err) {
      setGenerateError(
        err instanceof ShareUnavailableError
          ? t('export_share_unavailable')
          : t('postcard_generate_failed'),
      )
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <AccountFormLayout
      title={t('postcard_picker_title')}
      description={t('postcard_picker_description')}
    >
      {isLoading && (
        <View style={styles.grid}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} style={styles.skeletonTile} />
          ))}
        </View>
      )}

      {!isLoading && isError && <ErrorBanner message={t('postcard_memories_error')} />}

      {!isLoading && !isError && memoriesWithPhotos.length === 0 && (
        <Text style={styles.emptyText}>{t('postcard_no_photos')}</Text>
      )}

      {!isLoading && !isError && memoriesWithPhotos.length > 0 && (
        <>
          <View style={styles.grid}>
            {memoriesWithPhotos.map((memory) => {
              const cover = memory.media[0]
              const isSelected = selectedId === memory.id

              return (
                <Pressable
                  key={memory.id}
                  disabled={isGenerating}
                  onPress={() => selectMemory(memory.id)}
                  style={[styles.tile, isSelected && styles.tileSelected]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                >
                  {cover && (
                    <Image
                      source={{ uri: cover.url }}
                      style={styles.tileImage}
                      contentFit="cover"
                    />
                  )}
                </Pressable>
              )
            })}
          </View>
          <Textarea
            value={message}
            onChangeText={setMessage}
            placeholder={t('postcard_message_placeholder')}
            maxLength={POSTCARD_MESSAGE_MAX_LENGTH}
            editable={!isGenerating}
          />
        </>
      )}

      {generateError && <ErrorBanner message={generateError} />}

      <View style={styles.footerButtons}>
        <Button variant="secondary" size="sm" onPress={() => router.back()}>
          {t('postcard_cancel')}
        </Button>
        <Button
          size="sm"
          disabled={!selectedId || isGenerating}
          loading={isGenerating}
          onPress={handleGenerate}
        >
          {t('postcard_generate')}
        </Button>
      </View>
    </AccountFormLayout>
  )
}
