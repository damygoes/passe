'use client'

import type { Memory, MemoryMedia } from '@passe/types/memory'
import { Button } from '@passe/ui/button'
import { Icon } from '@passe/ui/icon'
import { formatTime } from '@passe/utils'
import { useTranslations } from 'next-intl'
import { EmptyGalleryPrompt } from './EmptyGalleryPrompt'
import { MemoryGalleryHero } from './MemoryGalleryHero'
import { MemoryThumbnailFilmstrip } from './MemoryThumbnailFilmstrip'

interface Props {
  memory: Memory
  media: MemoryMedia[]
  activePhoto: MemoryMedia | undefined
  selectedIndex: number
  onSelect: (index: number) => void
  onPrev: () => void
  onNext: () => void
  onAddPhotos: () => void
  photoAlt: string
}

export function MemoryGalleryPane({
  memory,
  media,
  activePhoto,
  selectedIndex,
  onSelect,
  onPrev,
  onNext,
  onAddPhotos,
  photoAlt,
}: Props) {
  const t = useTranslations('trips.memory_detail')

  function handleKeyDown(event: React.KeyboardEvent) {
    if (media.length <= 1) return
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      onPrev()
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      onNext()
    } else if (event.key === 'Home') {
      event.preventDefault()
      onSelect(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      onSelect(media.length - 1)
    }
  }

  return (
    <div
      className="washed flex min-h-[420px] min-w-0 flex-col gap-4.5 bg-dark-espresso-dark p-8 pb-6.5 lg:h-full"
      onKeyDown={handleKeyDown}
    >
      {media.length > 1 && (
        <div className="flex items-center justify-between gap-4 text-[#FAF6EE]">
          <div className="font-mono text-[10.5px] tracking-[0.14em] uppercase opacity-72">
            {t('photo_position', { current: selectedIndex + 1, total: media.length })}
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="rounded-full border border-[color-mix(in_srgb,#FAF6EE_30%,transparent)] text-[#FAF6EE] hover:bg-[color-mix(in_srgb,#FAF6EE_14%,transparent)]"
              aria-label={t('prev_photo')}
              onClick={onPrev}
            >
              <Icon name="chevron-left" size="sm" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="rounded-full border border-[color-mix(in_srgb,#FAF6EE_30%,transparent)] text-[#FAF6EE] hover:bg-[color-mix(in_srgb,#FAF6EE_14%,transparent)]"
              aria-label={t('next_photo')}
              onClick={onNext}
            >
              <Icon name="chevron-right" size="sm" />
            </Button>
          </div>
        </div>
      )}

      <div
        className="min-h-0 flex-1"
        aria-live="polite"
        aria-label={
          activePhoto
            ? `${t('photo_position', { current: selectedIndex + 1, total: media.length })} ${activePhoto.caption ?? ''}`
            : undefined
        }
      >
        {activePhoto ? (
          <MemoryGalleryHero photo={activePhoto} photoAlt={photoAlt} />
        ) : (
          <EmptyGalleryPrompt onAddPhotos={onAddPhotos} />
        )}
      </div>

      {activePhoto && (
        <div className="flex items-center justify-between gap-5 text-[#FAF6EE]">
          <div className="min-w-0 text-[13.5px] opacity-82">{activePhoto.caption}</div>
          <div className="flex-none font-mono text-[10.5px] tracking-[0.1em] opacity-60">
            {formatTime(activePhoto.capturedAt ?? memory.capturedAt)}
          </div>
        </div>
      )}

      {media.length > 1 && (
        <MemoryThumbnailFilmstrip
          media={media}
          selectedIndex={selectedIndex}
          onSelect={onSelect}
          onAddPhotos={onAddPhotos}
          photoAlt={photoAlt}
        />
      )}
    </div>
  )
}
