'use client'

import { animate, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef } from 'react'

export interface CountUpProps {
  value: number
  className?: string
  /** Delay in seconds before the count starts */
  delay?: number
}

/**
 * Ticks a number up from 0 to its final value once it scrolls into view.
 * Renders the final value immediately when the user prefers reduced motion.
 */
export function CountUp({ value, className, delay = 0 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const reducedMotion = useReducedMotion()
  // margin matches the whileInView convention used across the app (gentleSpring sections)
  const isInView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (reducedMotion) {
      node.textContent = String(value)
      return
    }
    if (!isInView) return
    const controls = animate(0, value, {
      duration: 0.8,
      ease: 'easeOut',
      delay,
      onUpdate: (latest) => {
        node.textContent = String(Math.round(latest))
      },
    })
    return () => controls.stop()
  }, [value, delay, reducedMotion, isInView])

  return (
    <span ref={ref} className={className}>
      0
    </span>
  )
}
