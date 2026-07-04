import { formatTripDateFull } from '@passe/utils'
import Image from 'next/image'
import { memoryMetaLabel, type EditorialMemoryData } from './editorial-types'

interface Props {
  memory: EditorialMemoryData
  photoAlt: string
}

// Pure CSS scroll-snap strip — no client JS, safe in server-rendered pages
export function CarouselSection({ memory, photoAlt }: Props) {
  const meta = memoryMetaLabel(memory)

  return (
    <figure className="space-y-3">
      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2">
        {memory.media.map((item) => (
          <div
            key={item.id}
            className="relative aspect-[4/3] w-4/5 shrink-0 snap-start overflow-hidden rounded-xl sm:w-3/5"
          >
            <Image
              src={item.url}
              alt={memory.note ?? photoAlt}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 80vw, 60vw"
            />
          </div>
        ))}
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
