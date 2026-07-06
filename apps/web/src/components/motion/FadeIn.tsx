'use client'

import { gentleSpring } from '@/lib/motion'
import { m } from 'motion/react'
import type { ComponentProps } from 'react'

export interface FadeInProps extends ComponentProps<typeof m.div> {
  /** Delay in seconds before the entrance starts */
  delay?: number
}

/**
 * Premium entrance for page headers and sections: content rises, fades, and
 * sharpens from a soft blur. Requires MotionProvider (protected views only).
 */
export function FadeIn({ delay = 0, children, ...props }: FadeInProps) {
  return (
    <m.div
      initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{
        ...gentleSpring,
        delay,
        filter: { duration: 0.45, ease: 'easeOut', delay },
      }}
      {...props}
    >
      {children}
    </m.div>
  )
}
