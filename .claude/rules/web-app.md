---
paths:
  - "apps/web/**"
---

# Web App Rules (Next.js App Router)

## Server vs Client Components
- All components are **Server Components by default** — do not add `'use client'` unless the component uses hooks, browser APIs, or event handlers
- Add `'use client'` at the top of the file, not inside a function
- Keep client components as leaf nodes — push `'use client'` as far down the tree as possible

## File Conventions (App Router)
```
app/
  layout.tsx        — root layout (server component)
  page.tsx          — route page (server component by default)
  loading.tsx       — streaming loading UI
  error.tsx         — error boundary ('use client' required)
  not-found.tsx     — 404 UI
  (group)/          — route groups (don't affect URL)
  [param]/          — dynamic segments
```

## Import Aliases
Use `@/` for all imports within `apps/web` — it maps to the `src/` directory:
```ts
import '@/styles/globals.css'
import { something } from '@/components/something'
```

## Using Shared Packages
```ts
import { Button } from '@repo/ui/button'
import { Input } from '@repo/ui/input'
import { UserSchema, type User } from '@passe/types'
```

## Styling
- Global CSS lives at `src/styles/globals.css`
- Tailwind is configured via `@import 'tailwindcss'` — no `tailwind.config.js` needed (Tailwind v4)
- Brand colors loaded via `@import '@passe/theme/styles'`
- UI component source is scanned via `@source '../../node_modules/@repo/ui/src'`

## Authentication (Clerk)
- Wrap auth-gated routes with Clerk middleware
- Use `currentUser()` in Server Components, `useUser()` in Client Components
- User `clerkId` maps to `User.clerkId` in `@passe/types`

## Data Fetching
- Prefer `async/await` in Server Components over `useEffect` + fetch
- Use `fetch` with appropriate `cache` options for static/dynamic data
- Keep data fetching in page/layout files or dedicated server action files
