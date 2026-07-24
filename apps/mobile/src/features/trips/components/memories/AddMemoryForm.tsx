import { canAddMemory } from '@passe/auth/plan-gates'
import {
  useCreateMemory,
  useMemories,
  useUpdateMemory,
  useUploadImage,
  useUser,
} from '@passe/hooks'
import type { Memory } from '@passe/types/memory'
import { createLogger } from '@passe/logger'
import { Image } from 'expo-image'
import * as ImagePicker from 'expo-image-picker'
import * as Location from 'expo-location'
import { useRouter } from 'expo-router'
import { useMemo, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'

import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { Icon } from '@/components/ui/icon'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorBanner } from '@/features/account/components/ErrorBanner'
import { DateField } from '@/features/trips/components/trip/date-field/DateField'
import { useTheme } from '@/hooks/useTheme'
import { haptics } from '@/lib/haptics'
import { useTranslations } from '@/i18n/useTranslations'
import { compressImage } from '@/lib/image-compression'
import { uploadFileToUrl } from '@/lib/upload-put'

const log = createLogger({ context: { module: 'features/trips/AddMemoryForm' } })

// `url` is what gets submitted (a bare S3 key for a fresh upload, or the
// existing resolved URL when editing unchanged photos). `previewUri` is
// what gets rendered — a local file uri for a fresh upload (the bare key
// isn't renderable on its own until the next read-resolve round-trip), or
// the same resolved URL as `url` for existing photos.
interface MemoryPhoto {
  url: string
  previewUri: string
  width: number | null
  height: number | null
}

function mediaToPhotos(media: Memory['media']): MemoryPhoto[] {
  return media.map((item) => ({
    url: item.url,
    previewUri: item.url,
    width: item.width ?? null,
    height: item.height ?? null,
  }))
}

interface AddMemoryFormProps {
  tripId: string
  // When provided, the form edits this memory; otherwise it creates a new one.
  memory?: Memory
}

export function AddMemoryForm({ tripId, memory }: AddMemoryFormProps) {
  const t = useTranslations('trips.new_memory')
  const tNew = useTranslations('trips.new')
  const tEdit = useTranslations('trips.edit_memory')
  const tUpload = useTranslations('trips.image_upload')
  const router = useRouter()
  const { colors, spacing, fontSizes, borderRadius } = useTheme()
  const { data: user } = useUser()
  const { data: memories = [] } = useMemories(tripId)
  const upload = useUploadImage()
  const { mutateAsync: createMemory, isPending: isCreating } = useCreateMemory()
  const { mutateAsync: updateMemory, isPending: isUpdating } = useUpdateMemory()

  const isEditing = Boolean(memory)
  const isPending = isCreating || isUpdating

  const [photos, setPhotos] = useState<MemoryPhoto[]>(() =>
    memory ? mediaToPhotos(memory.media) : [],
  )
  const [pendingUploads, setPendingUploads] = useState(0)
  const [note, setNote] = useState(() => memory?.note ?? '')
  const [capturedAt, setCapturedAt] = useState<Date>(() =>
    memory ? new Date(memory.capturedAt) : new Date(),
  )
  const [city, setCity] = useState(() => memory?.city ?? '')
  const [country, setCountry] = useState(() => memory?.country ?? '')
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    () => memory?.location ?? null,
  )
  const [isLocating, setIsLocating] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [contentError, setContentError] = useState<string | null>(null)
  const [globalError, setGlobalError] = useState<string | null>(null)

  const plan = user?.plan ?? 'free'
  const atMemoryLimit = !isEditing && !canAddMemory(plan, memories.length)
  const isUploading = pendingUploads > 0
  const isBusy = isPending || isUploading || atMemoryLimit

  const styles = useMemo(
    () =>
      StyleSheet.create({
        form: { gap: spacing[4] },
        fieldLabel: { fontSize: fontSizes.sm, fontWeight: '500', color: colors.foreground },
        fieldGroup: { gap: spacing[2] },
        errorText: { fontSize: fontSizes.xs, color: colors.destructive },
        photosRow: { flexDirection: 'row', gap: spacing[2] },
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
        uploadingTile: {
          width: 96,
          height: 96,
          borderRadius: borderRadius.lg,
        },
        pickerButtons: { flexDirection: 'row', gap: spacing[2] },
        pickerButton: { flex: 1 },
        locationRow: { flexDirection: 'row', alignItems: 'center', gap: spacing[2] },
        limitBanner: {
          gap: spacing[1],
          borderRadius: borderRadius.lg,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.muted,
          paddingHorizontal: spacing[4],
          paddingVertical: spacing[3],
        },
        limitText: { fontSize: fontSizes.sm, color: colors.mutedForeground },
        limitLink: { fontSize: fontSizes.sm, fontWeight: '500', color: colors.primary },
      }),
    [colors, spacing, fontSizes, borderRadius],
  )

  async function uploadAssets(assets: ImagePicker.ImagePickerAsset[]) {
    setContentError(null)
    setGlobalError(null)
    setPendingUploads(assets.length)
    for (const asset of assets) {
      try {
        const compressed = await compressImage(asset)
        const uploaded = await upload.mutateAsync({
          contentType: compressed.contentType,
          put: (uploadUrl) => uploadFileToUrl(uploadUrl, compressed.uri, compressed.contentType),
        })
        setPhotos((current) => [
          ...current,
          {
            url: uploaded.key,
            previewUri: compressed.uri,
            width: compressed.width,
            height: compressed.height,
          },
        ])
      } catch (err) {
        log.error('Photo upload failed', {
          error: err instanceof Error ? err.message : String(err),
        })
        setGlobalError(tUpload('upload_failed'))
      } finally {
        setPendingUploads((count) => count - 1)
      }
    }
  }

  async function handlePickFromLibrary() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: 10,
      quality: 0.8,
    })
    if (!result.canceled) await uploadAssets(result.assets)
  }

  async function handleTakePhoto() {
    const permission = await ImagePicker.requestCameraPermissionsAsync()
    if (!permission.granted) return
    const result = await ImagePicker.launchCameraAsync({ quality: 0.8 })
    if (!result.canceled) await uploadAssets(result.assets)
  }

  async function handleUseLocation() {
    setLocationError(null)
    setIsLocating(true)
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setLocationError(t('location_permission_denied'))
        return
      }
      const position = await Location.getCurrentPositionAsync({})
      setCoords({ lat: position.coords.latitude, lng: position.coords.longitude })
      const [place] = await Location.reverseGeocodeAsync({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      })
      if (place?.city) setCity(place.city)
      if (place?.country) setCountry(place.country)
    } catch {
      setLocationError(t('location_permission_denied'))
    } finally {
      setIsLocating(false)
    }
  }

  function handleRemovePhoto(index: number) {
    setPhotos((current) => current.filter((_, photoIndex) => photoIndex !== index))
  }

  async function handleSubmit() {
    setGlobalError(null)

    const trimmedNote = note.trim()
    if (!trimmedNote && photos.length === 0) {
      setContentError(t('errors.content_required'))
      return
    }
    setContentError(null)

    const commonFields = {
      note: trimmedNote || undefined,
      capturedAt,
      city: city.trim() || undefined,
      country: country.trim() || undefined,
      location: coords ?? undefined,
      media: photos.map((photo) => ({
        url: photo.url,
        mediaType: 'photo' as const,
        width: photo.width,
        height: photo.height,
      })),
    }

    // A memory explicitly locked to "Text only" never renders photos (see
    // resolveVariant in @passe/utils/editorial) — adding a photo here is an
    // affirmative action that should make it visible, so reset the layout.
    const shouldResetLayout = memory?.layoutVariant === 'text' && photos.length > 0

    try {
      if (memory) {
        await updateMemory({
          id: memory.id,
          tripId,
          ...commonFields,
          ...(shouldResetLayout ? { layoutVariant: 'auto' as const } : {}),
        })
      } else {
        await createMemory({ tripId, ...commonFields, isPublic: false })
      }
      haptics.success()
      router.back()
    } catch (err) {
      const fallback = isEditing ? tEdit('update_failed') : t('errors.create_failed')
      setGlobalError(err instanceof Error ? err.message : fallback)
    }
  }

  return (
    <View style={styles.form}>
      {globalError && <ErrorBanner message={globalError} />}
      {atMemoryLimit && (
        <View style={styles.limitBanner}>
          <Text style={styles.limitText}>{t('limit_reached')}</Text>
          <Pressable onPress={() => router.push('/(app)/account')} hitSlop={8}>
            <Text style={styles.limitLink}>{t('upgrade_cta')}</Text>
          </Pressable>
        </View>
      )}

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>{t('photos_label')}</Text>
        {(photos.length > 0 || isUploading) && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.photosRow}>
              {photos.map((photo, index) => (
                <View key={photo.previewUri} style={styles.photoWrapper}>
                  <Image
                    source={{ uri: photo.previewUri }}
                    style={styles.photo}
                    contentFit="cover"
                  />
                  <Pressable
                    onPress={() => handleRemovePhoto(index)}
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
            <Button variant="secondary" size="sm" onPress={handlePickFromLibrary} disabled={isBusy}>
              {t('pick_from_library')}
            </Button>
          </View>
          <View style={styles.pickerButton}>
            <Button variant="secondary" size="sm" onPress={handleTakePhoto} disabled={isBusy}>
              {t('take_photo')}
            </Button>
          </View>
        </View>
        {contentError && <Text style={styles.errorText}>{contentError}</Text>}
      </View>

      <FormField
        label={t('note_label')}
        placeholder={t('note_placeholder')}
        value={note}
        onChangeText={setNote}
        multiline
        numberOfLines={4}
      />

      <DateField
        label={t('date_label')}
        value={capturedAt}
        onChange={setCapturedAt}
        placeholder={t('date_label')}
        doneLabel={tNew('date_done')}
      />

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>{t('location_label')}</Text>
        <View style={styles.locationRow}>
          <Button
            variant="ghost"
            size="sm"
            onPress={handleUseLocation}
            disabled={isBusy || isLocating}
          >
            <View style={styles.locationRow}>
              <Icon name="location" size="sm" color={colors.primary} />
              <Text style={styles.limitLink}>
                {isLocating ? t('locating') : t('use_current_location')}
              </Text>
            </View>
          </Button>
        </View>
        {locationError && <Text style={styles.errorText}>{locationError}</Text>}
      </View>

      <FormField
        label={t('city_label')}
        placeholder={t('city_placeholder')}
        value={city}
        onChangeText={setCity}
      />

      <FormField
        label={t('country_label')}
        placeholder={t('country_placeholder')}
        value={country}
        onChangeText={setCountry}
      />

      <Button onPress={handleSubmit} loading={isPending} disabled={isBusy} fullWidth>
        {isEditing
          ? isPending
            ? tEdit('saving')
            : tEdit('save')
          : isPending
            ? t('creating')
            : t('create')}
      </Button>
    </View>
  )
}
