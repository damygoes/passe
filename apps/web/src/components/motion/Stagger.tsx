'use client'

import { staggerContainerVariants, staggerItemVariants } from '@/lib/motion'
import { m } from 'motion/react'
import type { ComponentProps } from 'react'

export interface StaggerProps extends ComponentProps<typeof m.div> {
  /**
   * Defer the cascade until the container scrolls into view (for grids/lists
   * further down the page). Defaults to animating on mount.
   */
  inView?: boolean
}

/**
 * Cascades its StaggerItem children in one-by-one with a soft spring.
 * Requires MotionProvider (protected views only).
 */
export function Stagger({ inView = false, children, ...props }: StaggerProps) {
  return (
    <m.div
      variants={staggerContainerVariants}
      initial="hidden"
      {...(inView
        ? { whileInView: 'visible', viewport: { once: false, margin: '0px 0px -10% 0px' } }
        : { animate: 'visible' })}
      {...props}
    >
      {children}
    </m.div>
  )
}

export function StaggerItem({ children, ...props }: ComponentProps<typeof m.div>) {
  return (
    <m.div variants={staggerItemVariants} {...props}>
      {children}
    </m.div>
  )
}
