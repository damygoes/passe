import { Image } from 'expo-image'
import { useMemo } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'

import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorBanner } from '@/features/account/components/ErrorBanner'
import { UpgradeBanner } from '@/features/account/components/UpgradeBanner'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'
import type { WizardPhoto } from './useAddMemoryWizard'

interface StepPhotoProps {
  photos: WizardPhoto[]
  isUploading: boolean
  isBusy: boolean
  atMemoryLimit: boolean
  contentError: string | null
  globalError: string | null
  onPickFromLibrary: () => void
  onTakePhoto: () => void
  onRemove: (index: number) => void
  onPressUpgrade: () => void
}

export function StepPhoto({
  photos,
  isUploading,
  isBusy,
  atMemoryLimit,
  contentError,
  globalError,
  onPickFromLibrary,
  onTakePhoto,
  onRemove,
  onPressUpgrade,
}: StepPhotoProps) {
  const t = useTranslations('trips.new_memory')
  const { colors, fonts, fontSizes, spacing, borderRadius } = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        title: {
          fontFamily: fonts.display,
          fontSize: fontSizes['3xl'],
          lineHeight: 34,
          color: colors.foreground,
          marginTop: spacing[4],
        },
        well: {
          height: 250,
          borderRadius: borderRadius.xl + spacing[3],
          backgroundColor: colors.muted,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: spacing[5],
          gap: spacing[2],
        },
        wellLabel: { fontSize: fontSizes.sm, color: colors.mutedForeground },
        photosRow: { flexDirection: 'row', gap: spacing[2], marginTop: spacing[5] },
        photoWrapper: {
          width: 96,
          height: 96,
          borderRadius: borderRadius.lg,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: colors.border,
        },
        photo: { width: '100%', height: '100%' },
        photoRemove: {
          position: 'absolute',
          top: spacing[1],
          right: spacing[1],
          width: 24,
          height: 24,
          borderRadius: 12,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.background,
        },
        uploadingTile: { width: 96, height: 96, borderRadius: borderRadius.lg },
        pickerButtons: { flexDirection: 'row', gap: spacing[2], marginTop: spacing[4] },
        pickerButton: { flex: 1 },
        errorText: { fontSize: fontSizes.xs, color: colors.destructive, marginTop: spacing[2] },
      }),
    [colors, fonts, fontSizes, spacing, borderRadius],
  )

  return (
    <View>
      {globalError && <ErrorBanner message={globalError} />}
      {atMemoryLimit && (
        <UpgradeBanner
          message={t('limit_reached')}
          ctaLabel={t('upgrade_cta')}
          onPressUpgrade={onPressUpgrade}
        />
      )}

      <Text style={styles.title}>{t('wizard.step1_title')}</Text>

      {photos.length === 0 && !isUploading ? (
        <Pressable onPress={onPickFromLibrary} disabled={isBusy}>
          <View style={styles.well}>
            <Icon name="camera" size="xl" color={colors.mutedForeground} />
            <Text style={styles.wellLabel}>{t('wizard.photo_placeholder')}</Text>
          </View>
        </Pressable>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.photosRow}>
            {photos.map((photo, index) => (
              <View key={photo.previewUri} style={styles.photoWrapper}>
                <Image source={{ uri: photo.previewUri }} style={styles.photo} contentFit="cover" />
                <Pressable
                  onPress={() => onRemove(index)}
                  style={styles.photoRemove}
                  hitSlop={8}
                  accessibilityLabel={t('remove_photo')}
                >
                  <Icon name="close" size="xs" color={colors.foreground} />
                </Pressable>
              </View>
            ))}
            {isUploading && <Skeleton style={styles.uploadingTile} />}
          </View>
        </ScrollView>
      )}

      <View style={styles.pickerButtons}>
        <View style={styles.pickerButton}>
          <Button variant="secondary" size="sm" onPress={onPickFromLibrary} disabled={isBusy}>
            {t('pick_from_library')}
          </Button>
        </View>
        <View style={styles.pickerButton}>
          <Button variant="secondary" size="sm" onPress={onTakePhoto} disabled={isBusy}>
            {t('take_photo')}
          </Button>
        </View>
      </View>
      {contentError && <Text style={styles.errorText}>{contentError}</Text>}
    </View>
  )
}
