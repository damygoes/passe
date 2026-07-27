import { gentleSpring } from '@/lib/motion'
import { useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import type { PointerEvent } from 'react'

const DEFAULT_TILT_RANGE = 12

/**
 * Cursor-driven 3D tilt — maps pointer position within an element to rotateX/rotateY.
 * Pair with `style={{ rotateX, rotateY }}` and `[transform-style:preserve-3d]` on the
 * target, and `[perspective:_]` on its parent.
 */
export function usePointerTilt(range: number = DEFAULT_TILT_RANGE) {
  const reducedMotion = useReducedMotion()

  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const springRotateX = useSpring(rotateX, gentleSpring)
  const springRotateY = useSpring(rotateY, gentleSpring)

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    if (reducedMotion) return
    const rect = event.currentTarget.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width - 0.5
    const py = (event.clientY - rect.top) / rect.height - 0.5
    rotateY.set(px * range)
    rotateX.set(py * -range)
  }

  function handlePointerLeave() {
    rotateX.set(0)
    rotateY.set(0)
  }

  return {
    rotateX: springRotateX,
    rotateY: springRotateY,
    handlePointerMove,
    handlePointerLeave,
  }
}
