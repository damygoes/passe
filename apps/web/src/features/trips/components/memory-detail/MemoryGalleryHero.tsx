import { getBlurProps } from '@/lib/media/image-blur'
import { createMediaLoader } from '@/lib/media/media-image-loader'
import type { MemoryMedia } from '@passe/types/memory'
import Image from 'next/image'

interface Props {
  photo: MemoryMedia
  photoAlt: string
}

// The single active photo in the gallery pane — keyed by photo id so
// next/image mounts a fresh element per photo, which is what drives the
// crossfade (the opacity transition below animates the newly-mounted image
// in from 0, not a shared element between photos).
export function MemoryGalleryHero({ photo, photoAlt }: Props) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[26px]">
      <Image
        key={photo.id}
        src={photo.url}
        alt={photo.caption ?? photoAlt}
        fill
        priority
        className="object-cover animate-in fade-in duration-200"
        sizes="(max-width: 1024px) 100vw, 62vw"
        {...getBlurProps(photo.placeholder)}
        {...(photo.srcset ? { loader: createMediaLoader(photo.srcset) } : {})}
      />
    </div>
  )
}
