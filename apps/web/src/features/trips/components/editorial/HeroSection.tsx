'use client'
// Rendered from public server-component views (no providers) — 'use client'
// here isn't for interactivity, it's required because next/image's `loader`
// prop is a function, and functions can't cross the server→client
// serialization boundary when passed down from a Server Component.

import { getBlurProps } from '@/lib/image-blur'
import { createMediaLoader } from '@/lib/media-image-loader'
import { formatTripDateFull } from '@passe/utils'
import Image from 'next/image'
import { memoryMetaLabel, type EditorialMemoryData } from './editorial-types'

interface Props {
  memory: EditorialMemoryData
  photoAlt: string
}

export function HeroSection({ memory, photoAlt }: Props) {
  const cover = memory.media[0]
  if (!cover) return null

  const meta = memoryMetaLabel(memory)

  return (
    <figure className="space-y-3">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl">
        <Image
          src={cover.url}
          alt={memory.note ?? photoAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 896px"
          {...getBlurProps(cover.placeholder)}
          {...(cover.srcset ? { loader: createMediaLoader(cover.srcset) } : {})}
        />
      </div>
      <figcaption className="flex items-baseline justify-between gap-4">
        {memory.note ? (
          <p className="text-sm text-foreground">{memory.note}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{meta}</p>
        )}
        <p className="shrink-0 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {formatTripDateFull(memory.capturedAt)}
        </p>
      </figcaption>
    </figure>
  )
}
