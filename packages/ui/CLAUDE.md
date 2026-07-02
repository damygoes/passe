# @passe/ui — Component Library Context

Shared React component library consumed by `apps/web`.
Components are built on **Base UI** primitives (`@base-ui/react`), styled with **Tailwind CSS 4** and **CVA**.

---

## Current Components

| Component      | Export path                | File                                    |
| -------------- | -------------------------- | --------------------------------------- |
| `AlertDialog`  | `@passe/ui/alert-dialog`   | `src/alert-dialog/AlertDialog.tsx`      |
| `Avatar`       | `@passe/ui/avatar`         | `src/avatar/Avatar.tsx`                 |
| `Badge`        | `@passe/ui/badge`          | `src/badge/Badge.tsx`                   |
| `Button`       | `@passe/ui/button`         | `src/button/Button.tsx`                 |
| `Card`         | `@passe/ui/card`           | `src/card/Card.tsx`                     |
| `DropdownMenu` | `@passe/ui/dropdown-menu`  | `src/dropdown-menu/DropdownMenu.tsx`    |
| `Empty`        | `@passe/ui/empty`          | `src/empty/Empty.tsx`                   |
| `Icon`         | `@passe/ui/icon`           | `src/icon/Icon.tsx`                     |
| `Input`        | `@passe/ui/input`          | `src/input/Input.tsx`                   |
| `Navbar`       | `@passe/ui/navbar`         | `src/navbar/Navbar.tsx`                 |
| `PageHeader`   | `@passe/ui/page-header`    | `src/page-header/PageHeader.tsx`        |
| `Separator`    | `@passe/ui/separator`      | `src/separator/Separator.tsx`           |
| `Skeleton`     | `@passe/ui/skeleton`       | `src/skeleton/Skeleton.tsx`             |
| `Textarea`     | `@passe/ui/textarea`       | `src/textarea/Textarea.tsx`             |

All components are also re-exported from the barrel — `import { Button } from '@passe/ui'` works too.

**Before writing raw HTML in any feature component, check this table.** If a component exists here,
use it — never recreate it with raw elements. For loading states use `<Skeleton>` from
`@passe/ui/skeleton`, not raw `<div className="animate-pulse bg-muted">` divs.

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
5. Add a colocated story file: `src/<name>/<Name>.stories.tsx`

Run `pnpm --filter @passe/ui generate:component` to scaffold the file structure automatically.

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
export interface ComponentProps extends PrimitiveProps, VariantProps<typeof componentVariants> {}
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

## Storybook

Each component has a colocated story file at `src/<name>/<Name>.stories.tsx`.

```bash
pnpm --filter @passe/ui storybook       # dev server at localhost:6006
pnpm --filter @passe/ui build-storybook # static build
```

Stories cover all CVA variants, sizes, and key interaction states (loading, disabled, etc.).

---

## Color System

Components use two layers of color classes — both are available after `@passe/theme/styles` is imported:

**Brand classes** (direct palette names):
`terracotta`, `terracotta-dark`, `aged-cream`, `sandy-beige`, `sandy-beige-dark`, `dark-espresso`

**Semantic aliases** (defined in `@passe/theme` and mapped to brand tokens):
`primary` → terracotta | `primary-foreground` → aged-cream
`secondary` → sandy-beige | `secondary-foreground` → dark-espresso
`muted` → sandy-beige-light | `muted-foreground` → muted-taupe
`border` → sandy-beige-dark | `input` → sandy-beige | `ring` → terracotta
`background` → aged-cream | `foreground` → dark-espresso | `destructive` → red-500

---

## Rules

- Named exports only — no default exports
- Use `cn()` for all conditional/merged class strings
- Use Base UI primitives (`@base-ui/react/*`) for interactive elements that need accessibility primitives
- Do not import from `apps/*` or `@passe/theme` directly — consume theme via Tailwind CSS custom properties
- `cn()` is imported from `@passe/utils` (a workspace package), not a local file — `import { cn } from '@passe/utils'`
- Other intra-package imports (components, icons) must use relative paths — the `@/` alias resolves to `apps/web/src/` at bundle time and will break the build
