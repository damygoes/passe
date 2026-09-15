'use client'

import { getBlurProps } from '@/lib/media/image-blur'
import { createMediaLoader } from '@/lib/media/media-image-loader'
import type { MemoryMedia } from '@passe/types/memory'
import { Icon } from '@passe/ui/icon'
import { cn } from '@passe/utils'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useEffect, useRef } from 'react'

// Above this many photos, thumbs switch from flex:1 (filling the strip) to
// a fixed width with horizontal scroll — matches the design's spec so a
// long filmstrip doesn't squeeze every thumb into a sliver.
const FIXED_WIDTH_THRESHOLD = 6

interface Props {
  media: MemoryMedia[]
  selectedIndex: number
  onSelect: (index: number) => void
  onAddPhotos: () => void
  photoAlt: string
}

// Roving-tabindex tablist per the design spec's keyboard/a11y requirements.
// This is the one place in the feature that uses a raw <button> instead of
// the shared <Button> component — it needs role="tab"/aria-selected/roving
// tabIndex semantics Button doesn't model, a deliberate, scoped exception.
export function MemoryThumbnailFilmstrip({
  media,
  selectedIndex,
  onSelect,
  onAddPhotos,
  photoAlt,
}: Props) {
  const t = useTranslations('trips.memory_detail')
  const activeRef = useRef<HTMLButtonElement>(null)
  const fixedWidth = media.length > FIXED_WIDTH_THRESHOLD

  useEffect(() => {
    activeRef.current?.scrollIntoView({ inline: 'center', behavior: 'smooth', block: 'nearest' })
  }, [selectedIndex])

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      onSelect((selectedIndex - 1 + media.length) % media.length)
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      onSelect((selectedIndex + 1) % media.length)
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
      role="tablist"
      aria-label={t('this_photograph')}
      className="flex flex-none gap-2.5 overflow-x-auto"
      onKeyDown={handleKeyDown}
    >
      {media.map((item, index) => {
        const isActive = index === selectedIndex
        return (
          <button
            key={item.id}
            ref={isActive ? activeRef : undefined}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={item.caption ?? photoAlt}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onSelect(index)}
            className={cn(
              'washed relative h-[76px] shrink-0 overflow-hidden rounded-2xl outline-2 outline-offset-2 outline-[#FAF6EE] focus-visible:outline',
              fixedWidth ? 'w-[76px]' : 'flex-1',
              isActive ? 'opacity-100 outline' : 'opacity-55 outline-0',
            )}
          >
            <Image
              src={item.url}
              alt=""
              fill
              className="object-cover"
              sizes="76px"
              {...getBlurProps(item.placeholder)}
              {...(item.srcset ? { loader: createMediaLoader(item.srcset) } : {})}
            />
          </button>
        )
      })}
      <button
        type="button"
        onClick={onAddPhotos}
        aria-label={t('add_photographs')}
        className="flex size-[76px] shrink-0 flex-col items-center justify-center gap-0.5 rounded-2xl border border-dashed border-[color-mix(in_srgb,#FAF6EE_34%,transparent)] text-[#FAF6EE] transition-colors hover:bg-[color-mix(in_srgb,#FAF6EE_10%,transparent)]"
      >
        <Icon name="plus" size="md" />
        <span className="font-mono text-[8px] tracking-[0.1em] uppercase opacity-75">
          {t('add_tile_label')}
        </span>
      </button>
    </div>
  )
}
