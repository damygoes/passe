'use client'

import { useUploadImage } from '@passe/hooks'
import { Button } from '@passe/ui/button'
import { Icon } from '@passe/ui/icon'
import { cn } from '@passe/utils'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useRef, useState } from 'react'

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

  const isBusy = upload.isPending || disabled

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    // Allow re-selecting the same file after a remove
    event.target.value = ''
    if (!file) return

    setUploadError(null)
    try {
      const uploaded = await upload.mutateAsync(file)
      onChange(uploaded.url)
    } catch {
      setUploadError(t('upload_failed'))
    }
  }

  function handleRemove() {
    setUploadError(null)
    onChange(null)
  }

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

      {value ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border">
          <Image
            src={value}
            alt={t('preview_alt')}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 640px"
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
