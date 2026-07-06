import { FadeIn, FadeInDown, ReduceMotion } from 'react-native-reanimated'
import type { WithSpringConfig } from 'react-native-reanimated'

// Single source of truth for the mobile motion language — entrances, list
// stagger, and press feedback all derive from these presets so every screen
// feels like one system. All presets respect the system reduce-motion setting.

export const pressSpring: WithSpringConfig = {
  damping: 18,
  stiffness: 300,
  mass: 0.6,
  reduceMotion: ReduceMotion.System,
}

/** Delay between consecutive items in a staggered list (ms) */
export const LIST_STAGGER_MS = 60

/** Items never wait longer than this before entering (ms) */
export const MAX_STAGGER_DELAY_MS = 300

/** Springy rise-and-fade entrance for headers, sections, and cards */
export function enterUp(delayMs = 0) {
  return FadeInDown.springify()
    .damping(18)
    .stiffness(160)
    .mass(0.9)
    .delay(delayMs)
    .reduceMotion(ReduceMotion.System)
}

/** Plain fade for containers whose children animate individually */
export function enterFade(delayMs = 0) {
  return FadeIn.duration(240).delay(delayMs).reduceMotion(ReduceMotion.System)
}

/** Capped index-based entrance delay for list/grid items */
export function listStagger(index: number) {
  return enterUp(Math.min(index * LIST_STAGGER_MS, MAX_STAGGER_DELAY_MS))
}
