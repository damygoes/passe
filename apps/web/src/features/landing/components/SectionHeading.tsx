import { cn } from '@passe/utils'
import type { ReactNode } from 'react'

export interface SectionHeadingProps {
  eyebrow?: ReactNode
  eyebrowClassName?: string
  title: ReactNode
  subtitle: ReactNode
  subtitleClassName?: string
  className?: string
}

export function SectionHeading({
  eyebrow,
  eyebrowClassName,
  title,
  subtitle,
  subtitleClassName,
  className,
}: SectionHeadingProps) {
  return (
    <div className={className}>
      {eyebrow && (
        <p
          className={cn(
            'mb-3 text-xs font-medium tracking-widest text-muted-foreground uppercase',
            eyebrowClassName,
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-3xl font-bold tracking-tight text-balance md:text-5xl">
        {title}
      </h2>
      <p className={cn('mt-3 text-sm text-muted-foreground md:text-base', subtitleClassName)}>
        {subtitle}
      </p>
    </div>
  )
}
