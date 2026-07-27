'use client'

import { snappySpring } from '@/lib/motion'
import { Logo } from '@passe/ui/logo'
import { cn } from '@passe/utils'
import { m } from 'motion/react'
import { PostmarkBadge } from './PostmarkBadge'

export function SectionStamp({ className, rotate = -12 }: { className?: string; rotate?: number }) {
  return (
    <m.div
      aria-hidden
      className={cn('pointer-events-none absolute', className)}
      initial={{ opacity: 0, scale: 1.6, rotate: rotate + 20 }}
      whileInView={{ opacity: 1, scale: 1, rotate }}
      viewport={{ once: true, margin: '0px 0px -20% 0px' }}
      transition={snappySpring}
    >
      <div className="relative flex size-24 items-center justify-center">
        <PostmarkBadge className="absolute inset-0 text-terracotta/30" />
        <div className="relative flex size-11 items-center justify-center rounded-full bg-transparent shadow-md">
          <Logo variant="mark" className="h-6 w-auto text-aged-cream" />
        </div>
      </div>
    </m.div>
  )
}
