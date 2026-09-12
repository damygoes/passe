'use client'

import { gentleSpring, snappySpring } from '@/lib/motion'
import { Icon, type IconName } from '@passe/ui/icon'
import { cn } from '@passe/utils'
import { m } from 'motion/react'
import Image, { type StaticImageData } from 'next/image'
import type { ReactNode } from 'react'
import { WashiTapeCorner } from './WashiTapeCorner'

export interface PhotoTextRowProps {
  imageSrc: StaticImageData
  imageAlt: string
  icon: IconName
  title: ReactNode
  description: ReactNode
  reversed?: boolean
  stepNumber?: number
}

export function PhotoTextRow({
  imageSrc,
  imageAlt,
  icon,
  title,
  description,
  reversed = false,
  stepNumber,
}: PhotoTextRowProps) {
  const photoOffset = reversed ? 48 : -48

  return (
    <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-16">
      <m.div
        className={cn('relative', reversed && 'md:order-2')}
        initial={{ opacity: 0, x: photoOffset }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false, margin: '0px 0px -15% 0px' }}
        transition={gentleSpring}
      >
        <WashiTapeCorner
          className={cn('-top-3', reversed ? '-right-2 rotate-6' : '-left-2 -rotate-6')}
        />
        {/* Back cards — fan out from a collapsed stack behind the photo as the row scrolls in */}
        <m.div
          aria-hidden
          className="absolute inset-0 rounded-xl bg-sandy-beige shadow-lg"
          initial={{ opacity: 0, rotate: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, rotate: reversed ? 8 : -8, scale: 1 }}
          viewport={{ once: false, margin: '0px 0px -15% 0px' }}
          transition={gentleSpring}
        />
        <m.div
          aria-hidden
          className="absolute inset-0 rounded-xl bg-aged-cream shadow-lg"
          initial={{ opacity: 0, rotate: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, rotate: reversed ? -4 : 4, scale: 1 }}
          viewport={{ once: false, margin: '0px 0px -15% 0px' }}
          transition={{ ...gentleSpring, delay: 0.05 }}
        />
        <m.div
          className="group relative aspect-[4/3] w-full overflow-hidden rounded-xl shadow-lg"
          whileHover={{ scale: 1.03 }}
          transition={snappySpring}
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover transition-[filter] duration-700 lg:grayscale lg:group-hover:grayscale-0"
            sizes="(max-width: 768px) 100vw, 50vw"
            loading="eager"
          />
        </m.div>
      </m.div>

      <m.div
        className={cn(reversed && 'md:order-1')}
        initial={{ opacity: 0, x: -photoOffset }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false, margin: '0px 0px -15% 0px' }}
        transition={{ ...gentleSpring, delay: 0.1 }}
      >
        {stepNumber !== undefined && (
          <span
            aria-hidden
            className="font-display block text-7xl font-bold text-primary/15 md:text-8xl"
          >
            {stepNumber}
          </span>
        )}
        <div
          className={cn(
            'flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary',
            stepNumber !== undefined ? '-mt-4 mb-4' : 'mb-3',
          )}
        >
          <Icon name={icon} size="lg" aria-hidden />
        </div>
        <h3 className="font-display text-2xl font-semibold md:text-4xl">{title}</h3>
        <p className="mt-3 text-lg text-muted-foreground">{description}</p>
      </m.div>
    </div>
  )
}
