'use client'

import { getBlurProps } from '@/lib/media/image-blur'
import { createMediaLoader } from '@/lib/media/media-image-loader'
import { cn, formatTripDateFull } from '@passe/utils'
import { Button } from '@passe/ui/button'
import { Icon } from '@passe/ui/icon'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { memoryMetaLabel, type EditorialMemoryData } from './editorial-types'

interface Props {
  memory: EditorialMemoryData
  photoAlt: string
  // Passed in rather than read via useTranslations — this component also
  // renders on public portfolio pages, which have no NextIntlClientProvider.
  scrollLeftLabel: string
  scrollRightLabel: string
}

export function CarouselSection({ memory, photoAlt, scrollLeftLabel, scrollRightLabel }: Props) {
  const meta = memoryMetaLabel(memory)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  useEffect(() => {
    const node = scrollerRef.current
    if (!node) return

    function updateScrollState() {
      if (!node) return
      setCanScrollLeft(node.scrollLeft > 4)
      setCanScrollRight(node.scrollLeft + node.clientWidth < node.scrollWidth - 4)
    }

    updateScrollState()
    node.addEventListener('scroll', updateScrollState, { passive: true })
    window.addEventListener('resize', updateScrollState)
    return () => {
      node.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [])

  function scrollByCard(direction: -1 | 1) {
    const node = scrollerRef.current
    if (!node) return
    const card = node.querySelector('[data-carousel-card]') as HTMLElement | null
    const distance = card ? card.offsetWidth + 12 : node.clientWidth * 0.8
    node.scrollBy({ left: direction * distance, behavior: 'smooth' })
  }

  return (
    <figure className="space-y-3">
      <div className="group/carousel relative">
        <div
          ref={scrollerRef}
          className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2"
        >
          {memory.media.map((item) => (
            <div
              key={item.id}
              data-carousel-card
              className="washed relative aspect-[4/3] w-4/5 shrink-0 snap-start overflow-hidden rounded-[26px] sm:w-3/5"
            >
              <Image
                src={item.url}
                alt={memory.note ?? photoAlt}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 80vw, 60vw"
                {...getBlurProps(item.placeholder)}
                {...(item.srcset ? { loader: createMediaLoader(item.srcset) } : {})}
              />
            </div>
          ))}
        </div>

        {canScrollLeft && (
          <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-background to-transparent" />
        )}
        {canScrollRight && (
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background to-transparent" />
        )}

        <Button
          type="button"
          variant="secondary"
          size="icon-sm"
          aria-label={scrollLeftLabel}
          onClick={() => scrollByCard(-1)}
          className={cn(
            'absolute left-2 top-1/2 -translate-y-1/2 opacity-0 transition-all duration-200',
            'group-hover/carousel:opacity-100 group-focus-within/carousel:opacity-100',
            'hover:-translate-x-0.5',
            !canScrollLeft && 'pointer-events-none opacity-0',
          )}
        >
          <Icon name="chevron-left" size="sm" />
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="icon-sm"
          aria-label={scrollRightLabel}
          onClick={() => scrollByCard(1)}
          className={cn(
            'absolute right-2 top-1/2 -translate-y-1/2 opacity-0 transition-all duration-200',
            'group-hover/carousel:opacity-100 group-focus-within/carousel:opacity-100',
            'hover:translate-x-0.5',
            !canScrollRight && 'pointer-events-none opacity-0',
          )}
        >
          <Icon name="chevron-right" size="sm" />
        </Button>
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
