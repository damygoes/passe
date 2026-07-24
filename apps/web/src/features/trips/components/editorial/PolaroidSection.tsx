'use client'
// Rendered from public server-component views (no providers) — 'use client'
// here isn't for interactivity, it's required because next/image's `loader`
// prop is a function, and functions can't cross the server→client
// serialization boundary when passed down from a Server Component.

import { getBlurProps } from '@/lib/media/image-blur'
import { createMediaLoader } from '@/lib/media/media-image-loader'
import { cn, formatTripDateFull, polaroidTilt } from '@passe/utils'
import Image from 'next/image'
import { TapeAccent } from '@/components/shared/ScrapbookAccents'
import { memoryMetaLabel, type EditorialMemoryData } from './editorial-types'

interface Props {
  memory: EditorialMemoryData
  photoAlt: string
}

export function PolaroidSection({ memory, photoAlt }: Props) {
  const photo = memory.media[0]
  if (!photo) return null

  const meta = memoryMetaLabel(memory)

  return (
    <figure className="flex justify-center py-4">
      <div
        className={cn(
          'relative w-full max-w-sm bg-warm-white p-3 pb-5 shadow-[0_8px_24px_rgba(44,26,14,0.12)]',
          polaroidTilt(memory.id) === 'left' ? '-rotate-2' : 'rotate-2',
        )}
      >
        {/* Polaroid's own frame is a content choice, not a theme effect — the
            tape shows under any theme. */}
        <TapeAccent />
        <div className="relative aspect-square w-full overflow-hidden">
          <Image
            src={photo.url}
            alt={memory.note ?? photoAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 384px"
            {...getBlurProps(photo.placeholder)}
            {...(photo.srcset ? { loader: createMediaLoader(photo.srcset) } : {})}
          />
        </div>
        {/* The paper mount is always warm-white regardless of app dark/light
            mode, so caption text uses fixed brand colors (not the
            foreground/muted-foreground aliases, which flip to near-white in
            dark mode and disappear against this light card). */}
        <figcaption className="mt-3 min-h-10 space-y-1 px-1">
          {memory.note ? (
            <p className="line-clamp-2 text-sm text-dark-espresso scrapbook:font-annotation scrapbook:text-lg">
              {memory.note}
            </p>
          ) : (
            <p className="text-sm text-muted-taupe scrapbook:font-annotation scrapbook:text-lg">
              {meta}
            </p>
          )}
          <p className="font-mono text-xs uppercase tracking-widest text-muted-taupe scrapbook:font-annotation scrapbook:text-base scrapbook:normal-case scrapbook:tracking-normal">
            {formatTripDateFull(memory.capturedAt)}
          </p>
        </figcaption>
      </div>
    </figure>
  )
}
