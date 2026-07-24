'use client'
// Rendered from public server-component views (no providers) — 'use client'
// here isn't for interactivity, it's required because next/image's `loader`
// prop is a function, and functions can't cross the server→client
// serialization boundary when passed down from a Server Component.

import { getBlurProps } from '@/lib/media/image-blur'
import { createMediaLoader } from '@/lib/media/media-image-loader'
import { formatTripDateFull } from '@passe/utils'
import Image from 'next/image'
import { memoryMetaLabel, type EditorialMemoryData } from './editorial-types'
import { ScrapbookPhotoFrame } from './ScrapbookPhotoFrame'

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
      <ScrapbookPhotoFrame id={memory.id} size="lg">
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
      </ScrapbookPhotoFrame>
      <figcaption className="flex items-baseline justify-between gap-4">
        {memory.note ? (
          <p className="text-sm text-foreground scrapbook:font-annotation scrapbook:text-lg">
            {memory.note}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground scrapbook:font-annotation scrapbook:text-lg">
            {meta}
          </p>
        )}
        <p className="shrink-0 font-mono text-xs uppercase tracking-widest text-muted-foreground scrapbook:font-annotation scrapbook:text-base scrapbook:normal-case scrapbook:tracking-normal">
          {formatTripDateFull(memory.capturedAt)}
        </p>
      </figcaption>
    </figure>
  )
}
