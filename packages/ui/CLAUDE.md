# @repo/ui — Component Library Context

Shared React component library consumed by `apps/web` and `apps/docs`.
Components are built on **Base UI** primitives (`@base-ui/react`), styled with **Tailwind CSS 4** and **CVA**.

---

## Current Components

| Component | Export path | File |
|-----------|-------------|------|
| `Avatar` | `@repo/ui/avatar` | `src/avatar/Avatar.tsx` |
| `Badge` | `@repo/ui/badge` | `src/badge/Badge.tsx` |
| `Button` | `@repo/ui/button` | `src/button/Button.tsx` |
| `Icon` | `@repo/ui/icon` | `src/icon/Icon.tsx` |
| `Input` | `@repo/ui/input` | `src/input/Input.tsx` |
| `Separator` | `@repo/ui/separator` | `src/separator/Separator.tsx` |
| `Textarea` | `@repo/ui/textarea` | `src/textarea/Textarea.tsx` |

All components are also re-exported from the barrel — `import { Button } from '@repo/ui'` works too.

Utilities:
- `cn()` — from `@passe/utils` (clsx + tailwind-merge). No longer part of this package.

---

## Adding a New Component

1. Create `src/<name>/<Name>.tsx`
2. Add named exports at the bottom: `export { Name, nameVariants }`
3. Add a re-export line to `src/index.ts`
4. Register in `package.json` exports map:
   ```json
   "./name": "./src/name/Name.tsx"
   ```

Run `pnpm --filter @repo/ui generate:component` to scaffold the file structure automatically.

---

## Component Patterns

### CVA for variants
```tsx
const componentVariants = cva('base-classes', {
  variants: { variant: { default: '...', outline: '...' } },
  defaultVariants: { variant: 'default' },
})
```

### Props interface
```tsx
export interface ComponentProps
  extends PrimitiveProps,
    VariantProps<typeof componentVariants> {}
```

### forwardRef (when wrapping native elements)
```tsx
export const Component = forwardRef<HTMLElement, ComponentProps>(
  function Component({ className, ...props }, ref) { ... }
)
Component.displayName = 'Component'
```

### data-slot attribute
All components add `data-slot="component-name"` to their root element for targeted CSS selectors.

---

## Icon System

Icons are backed by `@hugeicons/core-free-icons`. All icon usage goes through `<Icon>` — never import HugeIcons directly in consumer code.

**To add a new icon:**
1. Import the icon from `@hugeicons/core-free-icons` in `src/icon/icon-map.ts`
2. Add it to the `iconMap` object with a semantic key
3. `IconName` type auto-updates (it's `keyof typeof iconMap`)

Icon sizes: `xs` (12px) | `sm` (16px) | `md` (20px) | `lg` (24px) | `xl` (28px) | `2xl`–`5xl`

---

## Rules

- Named exports only — no default exports
- Use `cn()` for all conditional/merged class strings
- Use Base UI primitives (`@base-ui/react/*`) for interactive elements that need accessibility primitives
- Do not import from `apps/*` or `@passe/theme` directly — consume theme via Tailwind CSS custom properties
- Brand colors available as Tailwind classes: `terracotta`, `aged-cream`, `sandy-beige`, `dark-espresso`
- `cn()` is imported from `@passe/utils` (a workspace package), not a local file — `import { cn } from '@passe/utils'`
- Other intra-package imports (components, icons) must use relative paths — the `@/` alias resolves to `apps/web/src/` at bundle time and will break the build
