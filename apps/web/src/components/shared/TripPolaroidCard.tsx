'use client'
// next/image's `loader` prop is a function, and functions can't cross the
// server→client serialization boundary — same rule as every other media
// component in this codebase.

import { getBlurProps } from '@/lib/media/image-blur'
import { createMediaLoader } from '@/lib/media/media-image-loader'
import { Badge } from '@passe/ui/badge'
import { cn, formatDateRange, polaroidTilt } from '@passe/utils'
import Image from 'next/image'
import { TapeAccent } from './ScrapbookAccents'

interface TripPolaroidCardData {
  id: string
  title: string
  startDate: Date | string
  endDate: Date | string
  countries: string[]
  coverImageUrl?: string | null
  coverImagePlaceholder?: string | null
  coverImageSrcset?: Record<string, string> | null
}

interface Props {
  trip: TripPolaroidCardData
}

// The scrapbook theme's replacement for the full-bleed MediaCard trip
// tile — reuses the same tilted/taped polaroid language already
// established for individual memory photos (PolaroidSection), rather than
// inventing a third motif. Rendered alongside the editorial card and
// toggled via CSS (`scrapbook:hidden` / `hidden scrapbook:block`) by the
// caller — never rendered standalone, so it carries no theme gating of its
// own.
export function TripPolaroidCard({ trip }: Props) {
  return (
    <div
      className={cn(
        // Fixed max-width + centering keeps the polaroid a restrained,
        // human-scale object instead of stretching to fill its grid column
        // (which on a 3-up desktop grid ballooned it to 400px+).
        'relative mx-auto w-full max-w-[400px] bg-aged-cream p-3 pb-5 shadow-[0_10px_26px_rgba(44,26,14,0.22)] transition-transform duration-300 ease-out hover:rotate-0',
        polaroidTilt(trip.id) === 'left' ? '-rotate-2' : 'rotate-2',
      )}
    >
      <TapeAccent />
      <div className="relative aspect-square w-full overflow-hidden bg-sandy-beige">
        {trip.coverImageUrl ? (
          <Image
            src={trip.coverImageUrl}
            alt={trip.title}
            fill
            loading="eager"
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            {...getBlurProps(trip.coverImagePlaceholder)}
            {...(trip.coverImageSrcset ? { loader: createMediaLoader(trip.coverImageSrcset) } : {})}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sandy-beige via-sandy-beige-dark to-terracotta/40">
            <span className="font-display text-4xl text-dark-espresso/40">
              {trip.title.charAt(0)}
            </span>
          </div>
        )}
      </div>
      <figcaption className="mt-3 space-y-1.5 px-1">
        {/* The paper mount is always aged-cream regardless of app dark/light
            mode, so caption text uses fixed brand colors (not the
            foreground/muted-foreground aliases, which flip to near-white in
            dark mode and disappear against this light card). */}
        <h3 className="font-annotation text-2xl leading-snug text-dark-espresso">{trip.title}</h3>
        <p className="font-mono text-xs uppercase tracking-wide text-muted-taupe whitespace-nowrap">
          {formatDateRange(trip.startDate, trip.endDate)}
        </p>
        {trip.countries.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {trip.countries.map((country) => (
              <Badge key={country} variant="stamp">
                {country}
              </Badge>
            ))}
          </div>
        )}
      </figcaption>
    </div>
  )
}
