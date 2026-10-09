import { canExportPdf } from '@passe/auth/plan-gates'
import { usePasseApi, useMemories, useUser } from '@passe/hooks'
import { Image } from 'expo-image'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useMemo, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { AccountFormLayout } from '@/features/account/components/AccountFormLayout'
import { ErrorBanner } from '@/features/account/components/ErrorBanner'
import { UpgradeBanner } from '@/features/account/components/UpgradeBanner'
import {
  PlanGateError,
  ShareUnavailableError,
  downloadTripExport,
} from '@/features/trips/utils/downloadTripExport'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'
import { haptics } from '@/lib/haptics'
import { paywallRoute } from '@/lib/paywall-route'

// Mirrors PostcardSelectionSchema (@passe/types)
const POSTCARD_MESSAGE_MAX_LENGTH = 280

export function PostcardExportScreen() {
  const t = useTranslations('trips.detail')
  const tKeepsakes = useTranslations('trips.keepsakes')
  const router = useRouter()
  // memoryId is passed by callers that already know which memory the user
  // wants on the front (e.g. the Make a postcard button on memory detail), so
  // they don't land on the picker with nothing selected.
  const { id, memoryId } = useLocalSearchParams<{ id: string; memoryId?: string }>()
  const { data: memories = [], isLoading, isError } = useMemories(id)
  const { data: user } = useUser()
  const { baseUrl, getToken } = usePasseApi()
  const { colors, spacing, fontSizes, borderRadius } = useTheme()
  const [selectedId, setSelectedId] = useState<string | null>(memoryId ?? null)
  const [message, setMessage] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generateError, setGenerateError] = useState<string | null>(null)
  // Set when the server answers 403, so a plan change mid-session still lands
  // on the upgrade path rather than a generic retry message.
  const [serverLocked, setServerLocked] = useState(false)

  const memoriesWithPhotos = memories.filter((memory) => memory.media.length > 0)
  // Treat an unresolved user as unlocked — the entry points are already gated,
  // and flashing a paywall at a Collector while useUser() settles is worse
  // than relying on the server's 403 for the rare direct-open case.
  const isLocked = (user ? !canExportPdf(user.plan) : false) || serverLocked

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
        hintText: { fontSize: fontSizes.sm, color: colors.mutedForeground },
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
      if (err instanceof PlanGateError) {
        setServerLocked(true)
        return
      }
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

      {isLocked && (
        <UpgradeBanner
          message={t('postcard_locked_message')}
          ctaLabel={tKeepsakes('locked_cta')}
          onPressUpgrade={() => router.push(paywallRoute('postcard'))}
        />
      )}

      {generateError && <ErrorBanner message={generateError} />}

      {!isLocked && !selectedId && memoriesWithPhotos.length > 0 && (
        <Text style={styles.hintText}>{t('postcard_select_hint')}</Text>
      )}

      <View style={styles.footerButtons}>
        <Button variant="secondary" size="sm" onPress={() => router.back()}>
          {t('postcard_cancel')}
        </Button>
        {!isLocked && (
          <Button
            size="sm"
            disabled={!selectedId || isGenerating}
            loading={isGenerating}
            onPress={handleGenerate}
          >
            {t('postcard_generate')}
          </Button>
        )}
      </View>
    </AccountFormLayout>
  )
}
