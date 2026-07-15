import { useUploadImage } from '@passe/hooks'
import { createLogger } from '@passe/logger'
import { Image } from 'expo-image'
import * as ImagePicker from 'expo-image-picker'
import { useMemo, useState } from 'react'
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native'

import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'

const log = createLogger({ context: { module: 'features/trips/CoverImagePicker' } })

interface CoverImagePickerProps {
  value?: string | null
  onChange: (url: string | null) => void
  disabled?: boolean
}

export function CoverImagePicker({ value, onChange, disabled }: CoverImagePickerProps) {
  const t = useTranslations('trips.image_upload')
  const { colors, spacing, fontSizes, borderRadius } = useTheme()
  const upload = useUploadImage()
  const [uploadError, setUploadError] = useState<string | null>(null)

  const isBusy = upload.isPending || disabled

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { gap: spacing[2] },
        pickArea: {
          aspectRatio: 16 / 9,
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing[2],
          borderWidth: 1,
          borderStyle: 'dashed',
          borderColor: colors.border,
          borderRadius: borderRadius.lg,
          backgroundColor: colors.muted,
        },
        pickAreaDisabled: { opacity: 0.6 },
        pickText: { fontSize: fontSizes.sm, color: colors.mutedForeground },
        previewWrapper: {
          borderRadius: borderRadius.lg,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: colors.border,
        },
        preview: { aspectRatio: 16 / 9, width: '100%' },
        removeButtonWrapper: { position: 'absolute', top: spacing[2], right: spacing[2] },
        errorText: { fontSize: fontSizes.xs, color: colors.destructive },
      }),
    [colors, spacing, fontSizes, borderRadius],
  )

  async function handlePick() {
    setUploadError(null)
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    })
    const asset = result.assets?.[0]
    if (result.canceled || !asset) return

    try {
      const uploaded = await upload.mutateAsync({
        uri: asset.uri,
        name: asset.fileName ?? 'photo.jpg',
        type: asset.mimeType ?? 'image/jpeg',
      })
      onChange(uploaded.url)
    } catch (err) {
      log.error('Cover image upload failed', {
        error: err instanceof Error ? err.message : String(err),
      })
      setUploadError(t('upload_failed'))
    }
  }

  function handleRemove() {
    setUploadError(null)
    onChange(null)
  }

  return (
    <View style={styles.container}>
      {value ? (
        <View style={styles.previewWrapper}>
          <Image source={{ uri: value }} style={styles.preview} contentFit="cover" />
          <View style={styles.removeButtonWrapper}>
            <Button variant="secondary" size="sm" onPress={handleRemove} disabled={isBusy}>
              {t('remove')}
            </Button>
          </View>
        </View>
      ) : (
        <Pressable
          onPress={handlePick}
          disabled={isBusy}
          style={[styles.pickArea, isBusy && styles.pickAreaDisabled]}
          accessibilityRole="button"
          accessibilityLabel={t('upload_prompt')}
        >
          {upload.isPending ? (
            <ActivityIndicator color={colors.mutedForeground} />
          ) : (
            <Icon name="camera" size="lg" color={colors.mutedForeground} />
          )}
          <Text style={styles.pickText}>
            {upload.isPending ? t('uploading') : t('upload_prompt')}
          </Text>
        </Pressable>
      )}

      {uploadError && <Text style={styles.errorText}>{uploadError}</Text>}
    </View>
  )
}
