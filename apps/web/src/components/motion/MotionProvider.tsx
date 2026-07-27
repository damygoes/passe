'use client'

import { LazyMotion, MotionConfig, domAnimation } from 'motion/react'
import type { ReactNode } from 'react'

/**
 * Wraps protected views and the marketing landing page with motion's lazy
 * feature bundle and system-level reduced-motion handling. Mounted in the
 * (protected) layout and directly in LandingView — every other public route
 * (auth pages, legal/info pages, the DB-driven /u/[slug] portfolio pages)
 * still stays free of the motion runtime.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  )
}
