import { useUpdateMemory, useUploadImage } from '@passe/hooks'
import { createLogger } from '@passe/logger'
import type { CreateMemoryMedia, Memory } from '@passe/types/memory'
import * as ImagePicker from 'expo-image-picker'
import { useState } from 'react'

import { useTranslations } from '@/i18n/useTranslations'
import { compressImage } from '@/lib/image-compression'
import { uploadFileToUrl } from '@/lib/upload-put'

const log = createLogger({ context: { module: 'features/trips/useAddMemoryPhotos' } })

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

interface UseAddMemoryPhotosOptions {
  tripId: string
  memory: Memory
  // Called with the index the first newly-uploaded photo landed at, once
  // persisted — the design spec calls for selecting it.
  onAdded: (firstNewIndex: number) => void
}

// Shared upload orchestration for every "add photos" entry point on the
// memory detail screen (filmstrip "+" tile, "Add photos" button) — the same
// expo-image-picker -> compress -> sign -> PUT loop MemoryForm.tsx already
// uses, extracted so both consumers share one implementation.
export function useAddMemoryPhotos({ tripId, memory, onAdded }: UseAddMemoryPhotosOptions) {
  const t = useTranslations('trips.image_upload')
  const upload = useUploadImage()
  const updateMemory = useUpdateMemory()
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function addAssets(assets: ImagePicker.ImagePickerAsset[]) {
    setError(null)
    setIsUploading(true)
    try {
      const existing = memory.media.map(toCreateMemoryMedia)
      const added: CreateMemoryMedia[] = []
      for (const asset of assets) {
        const compressed = await compressImage(asset)
        const uploaded = await upload.mutateAsync({
          contentType: compressed.contentType,
          put: (uploadUrl) => uploadFileToUrl(uploadUrl, compressed.uri, compressed.contentType),
        })
        added.push({
          url: uploaded.key,
          mediaType: 'photo',
          width: compressed.width,
          height: compressed.height,
          caption: null,
          capturedAt: null,
        })
      }
      await updateMemory.mutateAsync({
        tripId,
        id: memory.id,
        media: [...existing, ...added],
      })
      onAdded(existing.length)
    } catch (err) {
      log.error('Photo upload failed', {
        error: err instanceof Error ? err.message : String(err),
      })
      setError(t('upload_failed'))
    } finally {
      setIsUploading(false)
    }
  }

  async function pickFromLibrary() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: 10,
      quality: 0.8,
    })
    if (!result.canceled) await addAssets(result.assets)
  }

  return { pickFromLibrary, isUploading, error }
}
