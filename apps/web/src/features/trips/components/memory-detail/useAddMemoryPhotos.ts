'use client'

import { compressImage } from '@/lib/media/image-compression'
import { useUpdateMemory, useUploadImage } from '@passe/hooks'
import type { CreateMemoryMedia, Memory } from '@passe/types/memory'
import { useTranslations } from 'next-intl'
import { useRef, useState } from 'react'

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

interface Options {
  tripId: string
  memory: Memory
  // Called with the index the first newly-uploaded photo landed at, once
  // the update has been persisted — the design spec calls for selecting it.
  onAdded: (firstNewIndex: number) => void
}

// Shared upload orchestration for every "add photos" entry point on the
// memory detail screen (footer button, filmstrip "+" tile, empty-gallery
// prompt) — mirrors MemoryPhotosField's compress → sign → PUT loop, then
// appends to the memory's media array via the existing wholesale-replace
// PATCH instead of a form-local array (there's no form here to submit).
export function useAddMemoryPhotos({ tripId, memory, onAdded }: Options) {
  const t = useTranslations('trips.image_upload')
  const inputRef = useRef<HTMLInputElement>(null)
  const upload = useUploadImage()
  const updateMemory = useUpdateMemory()
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function openPicker() {
    inputRef.current?.click()
  }

  async function handleFilesChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? [])
    event.target.value = ''
    if (files.length === 0) return

    setError(null)
    setIsUploading(true)
    try {
      const existing = memory.media.map(toCreateMemoryMedia)
      const added: CreateMemoryMedia[] = []
      for (const file of files) {
        const compressed = await compressImage(file)
        const uploaded = await upload.mutateAsync({
          contentType: compressed.contentType,
          put: async (uploadUrl) => {
            const res = await fetch(uploadUrl, {
              method: 'PUT',
              headers: { 'Content-Type': compressed.contentType },
              body: compressed.blob,
            })
            if (!res.ok) throw new Error(`Upload failed (HTTP ${res.status})`)
          },
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
    } catch {
      setError(t('upload_failed'))
    } finally {
      setIsUploading(false)
    }
  }

  return { inputRef, openPicker, handleFilesChange, isUploading, error }
}
