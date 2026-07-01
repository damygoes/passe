import {
  Alert01Icon,
  ArrowDown01Icon,
  ArrowRight01Icon,
  ArrowRight02Icon,
  AtIcon,
  Cancel02Icon,
  CreditCardIcon,
  Delete02Icon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  Logout01Icon,
  Mail01Icon,
  Menu01Icon,
  Moon02Icon,
  Orbit01Icon,
  Sun02Icon,
  Tick04Icon,
  UnfoldMoreIcon,
  User02Icon,
} from '@hugeicons/core-free-icons'
import type { IconName, IconSvgObject } from './types'

export const iconMap = {
  alert: Alert01Icon,
  'arrow-right': ArrowRight02Icon,
  at: AtIcon,
  check: Tick04Icon,
  delete: Delete02Icon,
  chevronDown: ArrowDown01Icon,
  'chevron-right': ArrowRight01Icon,
  'chevron-up-down': UnfoldMoreIcon,
  close: Cancel02Icon,
  'credit-card': CreditCardIcon,
  eye: EyeIcon,
  'eye-off': EyeOffIcon,
  loading: Orbit01Icon,
  lock: LockIcon,
  logout: Logout01Icon,
  mail: Mail01Icon,
  menu: Menu01Icon,
  moon: Moon02Icon,
  sun: Sun02Icon,
  user: User02Icon,
} as const satisfies Record<string, IconSvgObject>

// This gives a typed array of keys
export const iconNames = Object.keys(iconMap) as IconName[]
