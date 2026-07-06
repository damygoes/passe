'use client'

import { LazyMotion, MotionConfig, domAnimation } from 'motion/react'
import type { ReactNode } from 'react'

/**
 * Wraps protected views with motion's lazy feature bundle and system-level
 * reduced-motion handling. Mounted in the (protected) layout only — public
 * and landing pages must stay free of the motion runtime.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  )
}
