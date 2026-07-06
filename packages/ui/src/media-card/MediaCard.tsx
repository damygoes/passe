import { cn } from '@passe/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

const mediaCardVariants = cva(
  [
    'group/media-card relative isolate block aspect-[4/3] overflow-hidden rounded-xl bg-sandy-beige',
    'shadow-lg shadow-dark-espresso/15',
    'transition-all duration-300 ease-out',
    'hover:-translate-y-1 hover:rounded-xl hover:shadow-xl hover:shadow-dark-espresso/25',
    'motion-reduce:transition-none motion-reduce:hover:translate-y-0',
  ].join(' '),
  {
    variants: {
      tilt: {
        none: '',
        left: '-rotate-1 hover:rotate-0 hover:rounded-xl',
        right: 'rotate-1 hover:rotate-0 hover:rounded-xl',
      },
    },
    defaultVariants: {
      tilt: 'none',
    },
  },
)

export interface MediaCardProps
  extends React.ComponentProps<'div'>, VariantProps<typeof mediaCardVariants> {}

/**
 * Full-bleed photo card: the image fills the card and text sits on a glass
 * scrim at the bottom. Framework-agnostic — pass the image element (e.g.
 * next/image with `fill`) as a child of MediaCardMedia.
 */
function MediaCard({ className, tilt = 'none', ...props }: MediaCardProps) {
  return (
    <div data-slot="media-card" className={cn(mediaCardVariants({ tilt }), className)} {...props} />
  )
}

/**
 * Positioning + hover-zoom layer for the cover image. Any `img` rendered
 * inside (including next/image `fill`) covers the card and slowly zooms on
 * hover.
 */
function MediaCardMedia({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="media-card-media"
      className={cn(
        'absolute inset-0 overflow-hidden',
        '[&_img]:h-full [&_img]:w-full [&_img]:object-cover',
        '[&_img]:transition-transform [&_img]:duration-700 [&_img]:ease-out',
        'group-hover/media-card:[&_img]:scale-105 motion-reduce:[&_img]:transition-none',
        className,
      )}
      {...props}
    />
  )
}

/**
 * Bottom glass band: a blur layer masked to fade upward plus a warm tint
 * gradient, with content rendered on top.
 */
function MediaCardScrim({ className, children, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="media-card-scrim"
      className={cn('absolute inset-x-0 bottom-0', className)}
      {...props}
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-dark-espresso/65 via-dark-espresso/30 to-transparent backdrop-blur-sm [mask-image:linear-gradient(to_top,black_45%,transparent)]"
      />
      <div className="relative flex flex-col gap-1.5 p-4 pt-8">{children}</div>
    </div>
  )
}

function MediaCardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="media-card-title"
      className={cn(
        'cn-font-heading text-base leading-snug font-semibold text-aged-cream drop-shadow-sm',
        className,
      )}
      {...props}
    />
  )
}

function MediaCardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="media-card-description"
      className={cn('text-xs text-aged-cream/85', className)}
      {...props}
    />
  )
}

export {
  MediaCard,
  MediaCardDescription,
  MediaCardMedia,
  MediaCardScrim,
  MediaCardTitle,
  mediaCardVariants,
}
