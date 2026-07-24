'use client'

import { useUploadImage } from '@passe/hooks'
import { Button } from '@passe/ui/button'
import { Icon } from '@passe/ui/icon'
import { cn } from '@passe/utils'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { compressImage } from '@/lib/media/image-compression'

interface Props {
  id: string
  value?: string | null
  onChange: (url: string | null) => void
  disabled?: boolean
}

export function ImageUploadField({ id, value, onChange, disabled }: Props) {
  const t = useTranslations('trips.image_upload')
  const inputRef = useRef<HTMLInputElement>(null)
  const upload = useUploadImage()
  const [uploadError, setUploadError] = useState<string | null>(null)
  // A freshly uploaded file's key isn't renderable on its own (it's only
  // resolved into a signed delivery URL on the next read) — this local
  // object URL previews it immediately without waiting on that round-trip.
  const [previewUri, setPreviewUri] = useState<string | null>(null)
  const previewUriRef = useRef<string | null>(null)

  const isBusy = upload.isPending || disabled

  useEffect(() => {
    return () => {
      if (previewUriRef.current) URL.revokeObjectURL(previewUriRef.current)
    }
  }, [])

  function setPreview(uri: string | null) {
    if (previewUriRef.current) URL.revokeObjectURL(previewUriRef.current)
    previewUriRef.current = uri
    setPreviewUri(uri)
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    // Allow re-selecting the same file after a remove
    event.target.value = ''
    if (!file) return

    setUploadError(null)
    try {
      const compressed = await compressImage(file)
      const objectUrl = URL.createObjectURL(compressed.blob)
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
      setPreview(objectUrl)
      onChange(uploaded.key)
    } catch {
      setUploadError(t('upload_failed'))
    }
  }

  function handleRemove() {
    setUploadError(null)
    setPreview(null)
    onChange(null)
  }

  const displayUrl = previewUri ?? value

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/*"
        className="sr-only"
        disabled={isBusy}
        onChange={handleFileChange}
      />

      {displayUrl ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border">
          <Image
            src={displayUrl}
            alt={t('preview_alt')}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 640px"
            unoptimized={Boolean(previewUri)}
          />
          <div className="absolute right-2 top-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleRemove}
              disabled={isBusy}
              className="gap-1.5"
            >
              <Icon name="close" size="sm" />
              {t('remove')}
            </Button>
          </div>
        </div>
      ) : (
        <label
          htmlFor={id}
          className={cn(
            'flex aspect-video w-full cursor-pointer flex-col items-center justify-center gap-2',
            'rounded-lg border border-dashed border-border bg-muted/50 text-muted-foreground',
            'transition-colors hover:bg-muted',
            isBusy && 'pointer-events-none opacity-60',
          )}
        >
          <Icon
            name={upload.isPending ? 'loading' : 'camera'}
            size="lg"
            className={upload.isPending ? 'animate-spin' : undefined}
          />
          <span className="text-sm">{upload.isPending ? t('uploading') : t('upload_prompt')}</span>
        </label>
      )}

      {uploadError && <p className="text-xs text-destructive">{uploadError}</p>}
    </div>
  )
}
