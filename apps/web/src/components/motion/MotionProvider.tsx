'use client'

import { LazyMotion, MotionConfig, domAnimation } from 'motion/react'
import type { ReactNode } from 'react'

/**
 * Wraps protected views, the marketing landing page, and the legal/info pages
 * with motion's lazy feature bundle and system-level reduced-motion handling.
 * Mounted in the (protected) layout, directly in LandingView, and in the
 * (info) layout — the (info) layout needs it because it reuses LandingHeader,
 * whose ExitLink requires LandingExitProvider's `m`/AnimatePresence features.
 * Auth pages and the DB-driven /u/[slug] portfolio pages still stay free of
 * the motion runtime.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  )
}
