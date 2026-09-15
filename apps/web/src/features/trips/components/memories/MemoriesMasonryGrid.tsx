'use client'

import { Link } from '@/i18n/navigation'
import { getBlurProps } from '@/lib/media/image-blur'
import { createMediaLoader } from '@/lib/media/media-image-loader'
import { memoryRoute } from '@/lib/routes'
import type { Memory } from '@passe/types/memory'
import { formatMemoryDate } from '@passe/utils'
import Image from 'next/image'

interface Props {
  tripId: string
  memories: Memory[]
}

// A true masonry (not a fixed height rotation): each tile keeps its cover
// photo's real aspect ratio, so the varied rhythm comes from the actual
// photos rather than an arbitrary pattern. CSS columns give the tile-flows-
// into-shortest-column effect without a JS layout measurement pass.
const FALLBACK_ASPECT_RATIO = 4 / 5

export function MemoriesMasonryGrid({ tripId, memories }: Props) {
  return (
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
      {memories.map((memory) => {
        const cover = memory.media[0]
        const aspectRatio =
          cover?.width && cover.height ? cover.width / cover.height : FALLBACK_ASPECT_RATIO

        return (
          <Link
            key={memory.id}
            href={memoryRoute(tripId, memory.id)}
            className="mb-4 block break-inside-avoid"
          >
            <div
              className="washed relative w-full overflow-hidden rounded-[22px] bg-muted"
              style={{ aspectRatio }}
            >
              {cover && (
                <Image
                  src={cover.url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  {...getBlurProps(cover.placeholder)}
                  {...(cover.srcset ? { loader: createMediaLoader(cover.srcset) } : {})}
                />
              )}
            </div>
            <div className="mt-1.5 font-mono text-[9.5px] tracking-[0.08em] text-muted-foreground uppercase">
              {formatMemoryDate(memory.capturedAt)}
            </div>
            {memory.note && <div className="mt-0.5 truncate text-[13.5px]">{memory.note}</div>}
          </Link>
        )
      })}
    </div>
  )
}
