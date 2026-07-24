import { cn, polaroidTilt } from '@passe/utils'
import type { ComponentPropsWithoutRef } from 'react'
import { PhotoCornerAccent, TapeAccent } from '@/components/shared/ScrapbookAccents'

interface Props extends Omit<ComponentPropsWithoutRef<'div'>, 'id'> {
  id: string
  // 'lg' for full-width hero photos (smaller tilt so the frame can't clip
  // its column); 'md' for the smaller image-text/carousel photos (matches
  // PolaroidSection's angle).
  size: 'lg' | 'md'
}

// Wraps an existing photo block in a paper-frame/shadow/tilt treatment under
// the scrapbook theme, and does nothing under editorial (children render
// unchanged — a harmless extra `position: relative` wrapper). Applied to
// every photo-bearing section so the theme's visual difference doesn't
// depend on which layoutVariant a memory happens to use. Extra props
// (className, data-*) pass through to the root — CarouselSection needs
// this to keep its flex/snap sizing and `data-carousel-card` marker on the
// same element the frame renders.
export function ScrapbookPhotoFrame({ id, size, className, children, ...rest }: Props) {
  const tilt = polaroidTilt(id)

  return (
    <div
      className={cn(
        'relative',
        'scrapbook:bg-warm-white scrapbook:shadow-[0_10px_28px_rgba(44,26,14,0.18)]',
        size === 'lg' ? 'scrapbook:p-3' : 'scrapbook:p-2.5',
        size === 'lg'
          ? tilt === 'left'
            ? 'scrapbook:-rotate-1'
            : 'scrapbook:rotate-1'
          : tilt === 'left'
            ? 'scrapbook:-rotate-2'
            : 'scrapbook:rotate-2',
        className,
      )}
      {...rest}
    >
      {tilt === 'left' ? <TapeAccent scrapbookOnly /> : <PhotoCornerAccent scrapbookOnly />}
      {children}
    </div>
  )
}
