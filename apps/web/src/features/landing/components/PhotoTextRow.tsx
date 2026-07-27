import { cn } from '@passe/utils'
import { Icon, type IconName } from '@passe/ui/icon'
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
  return (
    <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-16">
      <div className={cn('relative', reversed && 'md:order-2')}>
        <WashiTapeCorner
          className={cn('-top-3', reversed ? '-right-2 rotate-6' : '-left-2 -rotate-6')}
        />
        <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-xl shadow-lg">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover transition-[filter] duration-700 lg:grayscale lg:group-hover:grayscale-0"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>

      <div className={cn(reversed && 'md:order-1')}>
        {stepNumber !== undefined && (
          <span aria-hidden className="font-display block text-6xl font-bold text-primary/15">
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
        <h3 className="font-heading text-xl font-semibold md:text-2xl">{title}</h3>
        <p className="mt-3 text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
