import type { Transition, Variants } from 'motion/react'

// Single source of truth for the in-app motion language — every entrance,
// stagger, and hover in protected views derives from these values so the
// whole product feels like one system.

export const gentleSpring: Transition = {
  type: 'spring',
  stiffness: 170,
  damping: 24,
  mass: 1,
}

export const snappySpring: Transition = {
  type: 'spring',
  stiffness: 340,
  damping: 26,
  mass: 0.8,
}

/** Delay step between consecutive page sections (seconds) */
export const SECTION_STEP = 0.1

/** Delay between consecutive items in a staggered grid/list (seconds) */
export const STAGGER_INTERVAL = 0.06

/** Children of a Stagger container never wait longer than this (seconds) */
export const MAX_STAGGER_DELAY = 0.3

export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: STAGGER_INTERVAL, delayChildren: 0.05 },
  },
}

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: gentleSpring },
}
