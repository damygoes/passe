---
paths:
  - "packages/ui/src/**"
---

# UI Component Rules

## Base UI Primitives
Interactive components (buttons, inputs, selects, dialogs) MUST use `@base-ui/react/*` primitives for accessibility — not raw `<button>` or `<input>` HTML elements. This ensures keyboard nav, ARIA, and focus management are handled correctly.

Exception: `Input` wraps `<input>` directly because Base UI's input primitive doesn't exist yet — use `React.forwardRef` and `React.InputHTMLAttributes<HTMLInputElement>`.

## CVA Variant Pattern
```tsx
const variants = cva('invariant-base-classes', {
  variants: {
    variant: { default: '...', outline: '...', ghost: '...' },
    size: { sm: '...', default: '...', lg: '...' },
  },
  defaultVariants: { variant: 'default', size: 'default' },
})
```
- Never use conditional `if/else` to select classes — put all variants in CVA
- Export the variants function alongside the component so consumers can extend styles

## Icon Props Pattern
When a component accepts an optional icon, use this interface pattern:
```tsx
icon?: IconName
iconPosition?: IconPosition   // 'start' | 'end'
iconSize?: IconSize
iconProps?: Omit<React.ComponentProps<typeof Icon>, 'name' | 'size' | 'aria-hidden'>
```
Map component sizes to icon sizes explicitly (see `iconSizeMap` in Button.tsx as reference).

## data-slot Convention
Every component root element must have `data-slot="component-name"`. This enables parent components and app-level CSS to target specific parts without class name collisions.

## Loading State
Use `icon="loading"` with `className="animate-spin"` wrapper — the `loading` icon (Orbit01Icon) is already in the iconMap.

## Intra-package Imports
Use **relative paths** for all imports within `packages/ui/src/` — do not use the `@/` alias
for internal imports. The `@/` alias is resolved by Turbopack using `apps/web/tsconfig.json`
and points to `apps/web/src/`, making it unusable inside packages.

```tsx
import { cn } from '../../utils/cn'      // ✅ relative
import { Icon } from '../icon/Icon'       // ✅ relative
import { cn } from '@/utils/cn'          // ❌ will break the build
```

## Tailwind Class Arrays
For components with many classes, use an array joined to a string:
```tsx
className={[
  'class-one',
  'class-two',
  'class-three',
].join(' ')}
```
This makes diffs cleaner and lines shorter.
