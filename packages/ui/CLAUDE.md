# @repo/ui — Component Library Context

Shared React component library consumed by `apps/web` and `apps/docs`.
Components are built on **Base UI** primitives (`@base-ui/react`), styled with **Tailwind CSS 4** and **CVA**.

---

## Current Components

| Component | Export path | File |
|-----------|-------------|------|
| `Button` | `@repo/ui/button` | `src/components/button/Button.tsx` |
| `Icon` | (used internally) | `src/components/icon/Icon.tsx` |
| `Input` | `@repo/ui/input` | `src/components/input/Input.tsx` |
| `Textarea` | `@repo/ui/textarea` | `src/components/textarea/Textarea.tsx` |

Utilities:
- `cn()` — `@repo/ui/utils` → `src/utils/cn.ts` (clsx + tailwind-merge)

---

## Adding a New Component

1. Create `src/components/<name>/<Name>.tsx`
2. Add a named export at the bottom: `export { Name, nameVariants }`
3. Register in `package.json` exports map:
   ```json
   "./name": "./src/components/name/Name.tsx"
   ```
4. No `index.ts` barrel files — one file per component, export from it directly

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
1. Import the icon from `@hugeicons/core-free-icons` in `src/components/icon/icon-map.ts`
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
- **Intra-package imports must use relative paths** — `../../utils/cn`, not `@/utils/cn`. The `@/` alias resolves to `apps/web/src/` at bundle time and will break the build.
