import { Reveal } from '@/components/shared/Reveal'
import { cn } from '@passe/utils'
import { Icon, type IconName } from '@passe/ui/icon'
import Image, { type StaticImageData } from 'next/image'
import type { ReactNode } from 'react'

export interface PhotoTextRowProps {
  imageSrc: StaticImageData
  imageAlt: string
  icon: IconName
  title: ReactNode
  description: ReactNode
  reversed?: boolean
  stepNumber?: number
  delay?: number
}

export function PhotoTextRow({
  imageSrc,
  imageAlt,
  icon,
  title,
  description,
  reversed = false,
  stepNumber,
  delay = 0,
}: PhotoTextRowProps) {
  return (
    <Reveal delay={delay} className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-16">
      <div
        className={cn(
          'relative aspect-[4/3] w-full overflow-hidden rounded-xl shadow-lg',
          reversed && 'md:order-2',
        )}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
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
    </Reveal>
  )
}
