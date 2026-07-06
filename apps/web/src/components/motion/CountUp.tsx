'use client'

import { animate, useReducedMotion } from 'motion/react'
import { useEffect, useRef } from 'react'

export interface CountUpProps {
  value: number
  className?: string
  /** Delay in seconds before the count starts */
  delay?: number
}

/**
 * Ticks a number up from 0 to its final value on entrance. Renders the final
 * value immediately when the user prefers reduced motion.
 */
export function CountUp({ value, className, delay = 0 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (reducedMotion) {
      node.textContent = String(value)
      return
    }
    const controls = animate(0, value, {
      duration: 0.8,
      ease: 'easeOut',
      delay,
      onUpdate: (latest) => {
        node.textContent = String(Math.round(latest))
      },
    })
    return () => controls.stop()
  }, [value, delay, reducedMotion])

  return (
    <span ref={ref} className={className}>
      0
    </span>
  )
}
