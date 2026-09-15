'use client'
// Rendered from public server-component views (no providers) — 'use client'
// here isn't for interactivity, it's required because next/image's `loader`
// prop is a function, and functions can't cross the server→client
// serialization boundary when passed down from a Server Component.

import { getBlurProps } from '@/lib/media/image-blur'
import { createMediaLoader } from '@/lib/media/media-image-loader'
import { cn, formatTripDateFull } from '@passe/utils'
import Image from 'next/image'
import { memoryMetaLabel, type EditorialMemoryData } from './editorial-types'

interface Props {
  memory: EditorialMemoryData
  side: 'left' | 'right'
  photoAlt: string
}

export function ImageTextSection({ memory, side, photoAlt }: Props) {
  const cover = memory.media[0]
  if (!cover) return null

  const extraCount = memory.media.length - 1
  const meta = memoryMetaLabel(memory)

  return (
    <div className="grid items-center gap-6 md:grid-cols-2 md:gap-10">
      <div
        className={cn(
          'washed relative aspect-[4/3] overflow-hidden rounded-[30px]',
          side === 'right' && 'md:order-2',
        )}
      >
        <Image
          src={cover.url}
          alt={memory.note ?? photoAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 448px"
          {...getBlurProps(cover.placeholder)}
          {...(cover.srcset ? { loader: createMediaLoader(cover.srcset) } : {})}
        />
        {extraCount > 0 && (
          <span className="absolute bottom-2 right-2 rounded-full bg-background/90 px-2 py-0.5 font-mono text-xs text-foreground">
            +{extraCount}
          </span>
        )}
      </div>

      <div className="space-y-4">
        {memory.note && (
          <p className="font-display text-[26px] leading-[1.35] text-foreground italic sm:text-[28px]">
            &ldquo;{memory.note}&rdquo;
          </p>
        )}
        <p className="font-mono text-[10.5px] tracking-[0.12em] text-muted-foreground uppercase">
          {[meta, formatTripDateFull(memory.capturedAt)].filter(Boolean).join(' · ')}
        </p>
      </div>
    </div>
  )
}
