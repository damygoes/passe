'use client'

import { cn } from '@passe/utils'
import { m } from 'motion/react'

const PATH_D = 'M4 118 C 90 12, 230 12, 356 70'

// Sampled points + tangent angles along PATH_D (t = 0, .2, .4, .6, .8, 1) so the
// plane glyph can travel the curve with plain x/y/rotate keyframes instead of a
// browser-dependent CSS offset-path.
const PLANE_X = [4, 61.5, 128.8, 202.4, 279.3, 356]
const PLANE_Y = [118, 66.7, 38.6, 31.3, 42.5, 70]
const PLANE_ROTATE = [-42, -32, -16, 3, 14, 20]

/**
 * A dashed "flight route" doodle, in the same hand-drawn style as
 * PostmarkBadge/WashiTapeCorner, that draws itself in with a small paper-plane
 * glyph traveling the curve — a nod to the app's travel/map identity.
 * Purely decorative (aria-hidden).
 */
export function FlightPathDoodle({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 360 130"
      className={cn('pointer-events-none overflow-visible', className)}
    >
      <m.path
        d={PATH_D}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="3 7"
        strokeLinecap="round"
        className="text-dark-espresso/20"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, ease: 'easeInOut', delay: 0.6 }}
      />
      <m.path
        d="M-5 0 L7 -3.5 L2 0 L7 3.5 Z"
        fill="currentColor"
        className="text-terracotta"
        initial={{ x: PLANE_X[0], y: PLANE_Y[0], rotate: PLANE_ROTATE[0], opacity: 0 }}
        whileInView={{ x: PLANE_X, y: PLANE_Y, rotate: PLANE_ROTATE, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2, ease: 'easeInOut', delay: 0.6 }}
      />
    </svg>
  )
}
