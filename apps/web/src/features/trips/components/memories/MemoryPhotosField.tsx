'use client'

import { useUploadImage } from '@passe/hooks'
import { Button } from '@passe/ui/button'
import { Icon } from '@passe/ui/icon'
import { cn } from '@passe/utils'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useState } from 'react'
import { compressImage } from '@/lib/image-compression'

// `url` is what gets submitted (a bare S3 key for a fresh upload, or the
// existing resolved URL when editing unchanged photos). `previewUri` is
// what gets rendered — a local object URL for a fresh upload (the bare key
// isn't renderable on its own until the next read-resolve round-trip), or
// the same resolved URL as `url` for existing photos.
export interface MemoryPhoto {
  url: string
  previewUri: string
  width: number | null
  height: number | null
}

interface Props {
  id: string
  photos: MemoryPhoto[]
  onAdd: (photo: MemoryPhoto) => void
  onRemove: (index: number) => void
  disabled?: boolean
}

export function MemoryPhotosField({ id, photos, onAdd, onRemove, disabled }: Props) {
  const t = useTranslations('trips.image_upload')
  const tMemory = useTranslations('trips.new_memory')
  const upload = useUploadImage()
  const [pendingCount, setPendingCount] = useState(0)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const isUploading = pendingCount > 0
  const isBusy = isUploading || disabled

  async function handleFilesChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? [])
    // Allow re-selecting the same files after a remove
    event.target.value = ''
    if (files.length === 0) return

    setUploadError(null)
    setPendingCount(files.length)
    for (const file of files) {
      try {
        const compressed = await compressImage(file)
        const previewUri = URL.createObjectURL(compressed.blob)
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
        onAdd({ url: uploaded.key, previewUri, width: compressed.width, height: compressed.height })
      } catch {
        setUploadError(t('upload_failed'))
      } finally {
        setPendingCount((count) => count - 1)
      }
    }
  }

  return (
    <div className="space-y-2">
      <input
        id={id}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        disabled={isBusy}
        onChange={handleFilesChange}
      />

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {photos.map((photo, index) => (
          <div
            key={photo.previewUri}
            className="group relative aspect-square overflow-hidden rounded-lg border border-border"
          >
            <Image
              src={photo.previewUri}
              alt={t('preview_alt')}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 33vw, 160px"
              unoptimized={photo.previewUri.startsWith('blob:')}
            />
            <div className="absolute right-1 top-1">
              <Button
                type="button"
                variant="secondary"
                size="icon-sm"
                onClick={() => onRemove(index)}
                disabled={isBusy}
                aria-label={tMemory('remove_photo')}
              >
                <Icon name="close" size="sm" />
              </Button>
            </div>
          </div>
        ))}

        <label
          htmlFor={id}
          className={cn(
            'flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5',
            'rounded-lg border border-dashed border-border bg-muted/50 text-muted-foreground',
            'transition-colors hover:bg-muted',
            isBusy && 'pointer-events-none opacity-60',
          )}
        >
          <Icon
            name={isUploading ? 'loading' : 'plus'}
            size="md"
            className={isUploading ? 'animate-spin' : undefined}
          />
          <span className="text-xs">{isUploading ? t('uploading') : tMemory('add_photo')}</span>
        </label>
      </div>

      {uploadError && <p className="text-xs text-destructive">{uploadError}</p>}
    </div>
  )
}
