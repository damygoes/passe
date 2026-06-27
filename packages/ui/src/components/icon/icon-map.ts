import {
  Alert01Icon,
  ArrowDown01Icon,
  ArrowRight01Icon,
  ArrowRight02Icon,
  Cancel02Icon,
  Orbit01Icon,
  Tick04Icon,
  UnfoldMoreIcon,
} from '@hugeicons/core-free-icons'
import type { IconName, IconSvgObject } from './types'

export const iconMap = {
  alert: Alert01Icon,
  'arrow-right': ArrowRight02Icon,
  check: Tick04Icon,
  chevronDown: ArrowDown01Icon,
  'chevron-right': ArrowRight01Icon,
  'chevron-up-down': UnfoldMoreIcon,
  close: Cancel02Icon,
  loading: Orbit01Icon,
} as const satisfies Record<string, IconSvgObject>

// This gives a typed array of keys
export const iconNames = Object.keys(iconMap) as IconName[]
