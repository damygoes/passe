import { canAddMemory } from '@passe/auth/plan-gates'
import { useCreateMemory, useMemories, useUploadImage, useUser } from '@passe/hooks'
import { createLogger } from '@passe/logger'
import * as ImagePicker from 'expo-image-picker'
import * as Location from 'expo-location'
import { useRouter } from 'expo-router'
import { useState } from 'react'

import { useTranslations } from '@/i18n/useTranslations'
import { haptics } from '@/lib/haptics'
import { compressImage } from '@/lib/image-compression'
import { uploadFileToUrl } from '@/lib/upload-put'

const log = createLogger({ context: { module: 'features/trips/AddMemoryWizard' } })

export interface WizardPhoto {
  url: string
  previewUri: string
  width: number | null
  height: number | null
}

export const WIZARD_STEP_COUNT = 3

// All state and side-effecting logic behind the 3-step add-memory wizard,
// pulled out of the screen so each step component only needs the slice of
// state/handlers it actually renders.
export function useAddMemoryWizard(tripId: string) {
  const t = useTranslations('trips.new_memory')
  const tUpload = useTranslations('trips.image_upload')
  const router = useRouter()
  const { data: user } = useUser()
  const { data: memories = [] } = useMemories(tripId)
  const upload = useUploadImage()
  const { mutateAsync: createMemory, isPending } = useCreateMemory()

  const [step, setStep] = useState(1)
  const [photos, setPhotos] = useState<WizardPhoto[]>([])
  const [pendingUploads, setPendingUploads] = useState(0)
  const [note, setNote] = useState('')
  const [capturedAt, setCapturedAt] = useState<Date>(() => new Date())
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [placeName, setPlaceName] = useState('')
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [tagsInput, setTagsInput] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [isLocating, setIsLocating] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [contentError, setContentError] = useState<string | null>(null)
  const [globalError, setGlobalError] = useState<string | null>(null)

  const plan = user?.plan ?? 'free'
  const atMemoryLimit = !canAddMemory(plan, memories.length)
  const isUploading = pendingUploads > 0
  const isBusy = isPending || isUploading || atMemoryLimit

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
      const street = [place?.streetNumber, place?.street].filter(Boolean).join(' ')
      if (street) setPlaceName(street)
    } catch {
      setLocationError(t('location_permission_denied'))
    } finally {
      setIsLocating(false)
    }
  }

  function handleRemovePhoto(index: number) {
    setPhotos((current) => current.filter((_, photoIndex) => photoIndex !== index))
  }

  function goToStep(next: number) {
    setStep(Math.min(Math.max(next, 1), WIZARD_STEP_COUNT))
  }

  function validatePhotoStep() {
    return true // photos are optional as long as a note is added later
  }

  async function handleSave() {
    setGlobalError(null)

    const trimmedNote = note.trim()
    if (!trimmedNote && photos.length === 0) {
      setContentError(t('errors.content_required'))
      goToStep(1)
      return
    }
    setContentError(null)

    const tags = tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)

    try {
      await createMemory({
        tripId,
        note: trimmedNote || undefined,
        capturedAt,
        city: city.trim() || undefined,
        country: country.trim() || undefined,
        placeName: placeName.trim() || undefined,
        tags,
        location: coords ?? undefined,
        isPublic,
        media: photos.map((photo) => ({
          url: photo.url,
          mediaType: 'photo' as const,
          width: photo.width,
          height: photo.height,
        })),
      })
      haptics.success()
      router.back()
    } catch (err) {
      setGlobalError(err instanceof Error ? err.message : t('errors.create_failed'))
    }
  }

  return {
    step,
    goToStep,
    validatePhotoStep,
    photos,
    isUploading,
    isBusy,
    isPending,
    atMemoryLimit,
    note,
    setNote,
    capturedAt,
    setCapturedAt,
    city,
    setCity,
    country,
    setCountry,
    placeName,
    setPlaceName,
    tagsInput,
    setTagsInput,
    isPublic,
    setIsPublic,
    isLocating,
    locationError,
    contentError,
    globalError,
    handlePickFromLibrary,
    handleTakePhoto,
    handleUseLocation,
    handleRemovePhoto,
    handleSave,
  }
}
