'use client'

import { Button } from '@passe/ui/button'
import { Textarea } from '@passe/ui/textarea'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

interface Props {
  initialCaption: string
  onSave: (caption: string) => void
  onCancel: () => void
}

// Replaces the caption text in place rather than opening a popover — the
// "This photograph" card is already the dedicated detail surface for the
// active photo, so a floating layer on top of it would be redundant.
export function PhotoCaptionEditor({ initialCaption, onSave, onCancel }: Props) {
  const t = useTranslations('trips.memory_detail')
  const [value, setValue] = useState(initialCaption)

  return (
    <div className="mt-2 space-y-2">
      <Textarea
        autoFocus
        rows={2}
        value={value}
        placeholder={t('caption_placeholder')}
        onChange={(event) => setValue(event.target.value)}
        maxLength={300}
        className="text-[14.5px]"
      />
      <div className="flex gap-2">
        <Button type="button" size="sm" onClick={() => onSave(value.trim())}>
          {t('caption_save')}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          {t('caption_cancel')}
        </Button>
      </div>
    </div>
  )
}
