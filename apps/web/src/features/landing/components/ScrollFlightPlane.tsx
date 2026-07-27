'use client'

import { Icon } from '@passe/ui/icon'
import { m, useReducedMotion, useScroll, useTransform } from 'motion/react'
import type { RefObject } from 'react'

export function ScrollFlightPlane({
  containerRef,
}: {
  containerRef: RefObject<HTMLElement | null>
}) {
  const reducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Stays in the right-hand page gutter for its whole journey — content is centered in a
  // max-w container, so this keeps the icon from ever crossing over section text.
  const top = useTransform(scrollYProgress, [0, 1], ['4%', '96%'])
  const left = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    ['92%', '86%', '95%', '88%', '92%'],
  )
  const rotate = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [24, -8, 20, -14, 16])
  const opacity = useTransform(scrollYProgress, [0, 0.06, 0.92, 1], [0, 1, 1, 0])

  if (reducedMotion) return null

  return (
    <m.div
      aria-hidden
      className="pointer-events-none absolute z-10 hidden text-terracotta md:block"
      style={{ top, left, rotate, opacity }}
    >
      <Icon name="camera" size="5xl" />
    </m.div>
  )
}
