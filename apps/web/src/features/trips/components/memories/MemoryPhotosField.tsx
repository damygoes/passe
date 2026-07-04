'use client'

import { useUploadImage, type UploadedImage } from '@passe/hooks'
import { Button } from '@passe/ui/button'
import { Icon } from '@passe/ui/icon'
import { cn } from '@passe/utils'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useState } from 'react'

interface Props {
  id: string
  photos: UploadedImage[]
  onAdd: (photo: UploadedImage) => void
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
        const uploaded = await upload.mutateAsync(file)
        onAdd(uploaded)
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
            key={photo.url}
            className="group relative aspect-square overflow-hidden rounded-lg border border-border"
          >
            <Image
              src={photo.url}
              alt={t('preview_alt')}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 33vw, 160px"
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
