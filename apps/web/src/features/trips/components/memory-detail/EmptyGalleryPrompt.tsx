'use client'

import { Icon } from '@passe/ui/icon'
import { useTranslations } from 'next-intl'

interface Props {
  onAddPhotos: () => void
}

// The gallery pane's 0-photo state — a dashed drop-zone on the same
// accent-900 ground the hero would otherwise fill.
export function EmptyGalleryPrompt({ onAddPhotos }: Props) {
  const t = useTranslations('trips.memory_detail')

  return (
    <button
      type="button"
      onClick={onAddPhotos}
      className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-[26px] border border-dashed border-[color-mix(in_srgb,#FAF6EE_34%,transparent)] text-[#FAF6EE] transition-colors hover:bg-[color-mix(in_srgb,#FAF6EE_10%,transparent)]"
    >
      <Icon name="photo-stack" size="xl" />
      <span className="font-mono text-[10.5px] tracking-[0.14em] uppercase opacity-75">
        {t('empty_gallery_prompt')}
      </span>
    </button>
  )
}
