---
paths:
  - 'apps/web/**'
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
import { Button } from '@passe/ui/button'
import { Input } from '@passe/ui/input'
import { UserSchema, type User } from '@passe/types'
```

## Styling

- Global CSS lives at `src/styles/globals.css`
- Tailwind is configured via `@import 'tailwindcss'` — no `tailwind.config.js` needed (Tailwind v4)
- Brand colors loaded via `@import '@passe/theme/styles'`
- UI component source is scanned via `@source '../../node_modules/@passe/ui/src'`

## Authentication (Clerk)

- Wrap auth-gated routes with Clerk middleware
- Use `currentUser()` in Server Components, `useUser()` in Client Components
- User `clerkId` maps to `User.clerkId` in `@passe/types`

## Data Fetching

- Prefer `async/await` in Server Components over `useEffect` + fetch
- Use `fetch` with appropriate `cache` options for static/dynamic data
- Keep data fetching in page/layout files or dedicated server action files

## Feature Architecture

- `app/` is for routing only — pages, layouts, loading.tsx, error.tsx, not-found.tsx. No component logic, no utility functions.
- All UI components belong in `src/features/<feature>/components/<ComponentName>.tsx`
- All utility functions (date formatting, etc.) belong in `packages/utils`, imported via `@passe/utils`
- Reusable API hooks belong in `packages/hooks`, imported via `@passe/hooks`
- Follow the pattern already established in `src/features/auth/`

### Existing features

```
src/features/
  auth/
    components/   — SignInForm, SignUpForm, ForgotPasswordForm, ResetPasswordForm,
                    SocialAuthButtons, LogoutButton, PasswordStrengthMeter, PasswordMatchIndicator
    schemas/      — auth.ts (Zod form schemas)
  trips/
    components/   — DashboardView, TripDetailView, TripCard, TripStats, MemoryCard,
                    NoTripsEmpty, NoMemoriesEmpty
```

### Code conventions

- **Callback parameter names**: Never use single-letter or ambiguous names in array method callbacks (`.map(t => ...)`, `.flatMap(m => ...)`). Always use the full domain name (`.map(trip => ...)`, `.flatMap(memory => ...)`). `t` is reserved as the conventional name for the `useTranslations` return value.
- **Translations**: All user-visible strings must use `useTranslations` from `next-intl`. Add keys to the relevant namespace in `packages/i18n/src/locales/en.json` and `de.json`. Never hardcode English strings in component files.
- **Empty states**: Empty states must be standalone components in `src/features/<feature>/components/` — never inline JSX inside a view component.
