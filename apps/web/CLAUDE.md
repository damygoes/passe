# apps/web — Next.js 16 App

Main Passé product. App Router, Clerk auth, Tailwind CSS 4.

---

## Auth setup

Auth is handled by `@clerk/nextjs` (installed) + `@passe/auth` (shared utilities).

### proxy.ts (middleware)

Next.js 16 uses `proxy.ts` instead of `middleware.ts`. It wraps `clerkMiddleware` and protects
all routes except those in `PUBLIC_ROUTES` (defined in `@passe/auth/constants`):

```
apps/web/proxy.ts
```

### Clerk webhook

`POST /api/webhooks/clerk` verifies the Clerk webhook signature and calls `syncClerkUser` from
`@passe/auth/webhook` to keep the `users` table in sync. Register this endpoint in the
[Clerk Dashboard → Webhooks](https://dashboard.clerk.com).

```
apps/web/app/api/webhooks/clerk/route.ts
```

### Server-side auth

In server components and actions, use `@clerk/nextjs/server`:

```typescript
import { auth, currentUser } from '@clerk/nextjs/server'

// In an async server component:
const { userId } = await auth()
const user = await currentUser()
```

---

## Environment variables

Copy `.env.local.example` → `.env.local` and fill in:

| Variable | Source |
|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk Dashboard → API Keys |
| `CLERK_SECRET_KEY` | Clerk Dashboard → API Keys |
| `CLERK_WEBHOOK_SECRET` | Clerk Dashboard → Webhooks → Signing secret |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/sign-up` |
| `DATABASE_URL` | Neon Dashboard → Pooled connection string |

---

## Custom auth pages

All auth pages use custom forms (not Clerk's hosted components). Forms live in
`src/features/auth/components/` and use React Hook Form + Zod. Clerk hooks provide the auth logic.

| Component | File | Purpose |
|---|---|---|
| `SignInForm` | `src/features/auth/components/SignInForm.tsx` | Email + password sign-in |
| `SignUpForm` | `src/features/auth/components/SignUpForm.tsx` | Sign-up with display name + OTP verification step |
| `ForgotPasswordForm` | `src/features/auth/components/ForgotPasswordForm.tsx` | Email entry → sends reset code |
| `ResetPasswordForm` | `src/features/auth/components/ResetPasswordForm.tsx` | OTP code + new password |
| `SocialAuthButtons` | `src/features/auth/components/SocialAuthButtons.tsx` | Google + Apple OAuth |

Zod schemas for all forms: `src/features/auth/schemas/auth.ts`

### Sign-in flow
1. Email + password → `signIn.create()`
2. If `status === 'complete'` → `setActive()` → redirect to dashboard
3. If `status === 'needs_client_trust'` or `'needs_second_factor'` → `prepareSecondFactor({ strategy: 'email_code' })` → OTP step → `attemptSecondFactor()` → `setActive()` → redirect

### Sign-up flow (two steps)
1. User fills display name + email + password → `signUp.create()` + `prepareEmailAddressVerification()`
2. OTP input shown → `signUp.attemptEmailAddressVerification()` → `setActive()` → redirect

### Social auth
Social OAuth (`oauth_google`, `oauth_apple`) uses `signIn.authenticateWithRedirect()` with
`redirectUrl: '/sso-callback'`. The `/sso-callback` page runs `AuthenticateWithRedirectCallback`
which completes the OAuth flow. Both `/sso-callback` and `/forgot-password`, `/reset-password`
are in `PUBLIC_ROUTES` (see `packages/auth/src/constants.ts`).

### Password reset flow
1. `/forgot-password` → email form → `signIn.create({ strategy: 'reset_password_email_code' })`
2. Email stored in `sessionStorage('reset-email')` → redirect to `/reset-password`
3. `/reset-password` → OTP + new password → `signIn.attemptFirstFactor()` → `setActive()`

---

## Feature Architecture

`app/` is for **routing only** — pages, layouts, loading.tsx, error.tsx, not-found.tsx. Never
define components or utility functions inside route files.

All feature logic lives under `src/features/<feature>/`:

```
src/features/
  auth/
    components/   — SignInForm, SignUpForm, ForgotPasswordForm, ResetPasswordForm,
                    SocialAuthButtons, LogoutButton, PasswordStrengthMeter, PasswordMatchIndicator
    schemas/      — auth.ts (Zod form schemas)
  trips/
    components/   — DashboardView, TripDetailView, TripCard, TripStats, MemoryCard
```

Rules:
- Component files go in `src/features/<feature>/components/<ComponentName>.tsx`
- Route files (`app/`) only extract params and render one feature view component — no queries, no auth calls, no JSX logic
- View components (e.g. `DashboardView`, `TripDetailView`) are `'use client'` and own all data fetching via `@passe/hooks`
- Date/time formatting and other utilities go in `packages/utils`, imported via `@passe/utils`
- Reusable API hooks go in `packages/hooks`, imported via `@passe/hooks`
- Import feature components using the `@/` alias: `import { DashboardView } from '@/features/trips/components/DashboardView'`

---

## Key rules

- `auth()` and `currentUser()` are async in Next.js 16 — always `await` them
- Never import `@clerk/nextjs/server` in client components (`'use client'`)
- `@passe/auth/webhook` is server-only (it initializes `@passe/db/client`) — only import in API routes or server actions
- Route protection is all-or-nothing via `proxy.ts` — individual pages do not need to call `auth.protect()` unless they need the redirect behavior
- Full-screen overlays (`fixed inset-0`) rendered inside `<Navbar>` must use `ReactDOM.createPortal(..., document.body)` — the navbar's `backdrop-blur-sm` establishes a CSS containing block that traps `position: fixed` descendants to the navbar's height instead of the viewport

---

## API layer

### Route structure

```
app/api/
  user/route.ts                          — GET /api/user, PATCH /api/user
  trips/route.ts                         — GET /api/trips, POST /api/trips
  trips/[id]/route.ts                    — GET, PATCH, DELETE /api/trips/[id]
  trips/[id]/memories/route.ts           — GET, POST /api/trips/[id]/memories
  trips/[id]/memories/[memoryId]/route.ts — PATCH, DELETE /api/trips/[id]/memories/[memoryId]
  memories/route.ts                      — GET /api/memories (all user memories)
  webhooks/clerk/route.ts                — POST /api/webhooks/clerk
```

### Shared helpers — `src/lib/api.ts`

| Helper | Purpose |
|---|---|
| `apiError(message, status)` | Returns `{ error: message }` JSON with the given status |
| `apiSuccess(data, status?)` | Returns `{ data }` JSON, default status 200 |
| `requireAuth()` | Calls `auth()`, returns `{ userId, error: null }` or `{ userId: null, error: Response }` |

Call `requireAuth()` at the top of every protected handler:

```typescript
const { userId, error } = await requireAuth()
if (error) return error
```

### Validation pattern

Every route validates **twice** with Zod:
1. **Request body** — `Schema.safeParse(body)` → return 400 on failure (client error, not logged)
2. **DB output** — `Schema.safeParse(dbRow)` → return 500 on failure (data integrity alert, always logged)

```typescript
// Validate DB output — log before returning 500
const parsed = TripSchema.safeParse(trip)
if (!parsed.success) {
  log.error('DB output failed schema validation', { issues: parsed.error.issues })
  return apiError('Invalid trip data', 500)
}
```

### DB error handling

Mutating operations (INSERT, UPDATE, DELETE) are wrapped in try/catch:

```typescript
try {
  ;[updated] = await db.update(trips).set({ ... }).returning()
} catch (err) {
  log.error('DB write failed', { error: err instanceof Error ? err.message : String(err) })
  return apiError('Internal server error', 500)
}
```

SELECT queries (`findFirst`, `findMany`) are not wrapped — they return `null`/`[]` gracefully
and unexpected throws are caught by Next.js.

---

## Logging

All API routes use `@passe/logger` with a file-scoped logger:

```typescript
import { createLogger } from '@passe/logger'
const log = createLogger({ context: { module: 'api/trips' } })
```

**Log these:**
- DB output schema validation failures (data integrity — should never happen)
- DB write exceptions (INSERT/UPDATE/DELETE throws)

**Do not log:**
- 401s from `requireAuth()` — expected, high-volume
- 400 request validation failures — client errors, not server errors
- 404s — expected business logic

In client components, use the default singleton: `import { logger } from '@passe/logger'`

Module naming convention: `api/<resource>` (e.g. `api/trips`, `api/trips/id`, `api/user`)

---

## Hooks (`@passe/hooks`)

Shared API hooks for client components. Backed by TanStack Query v5.

### Provider setup

`ApiProvider` is mounted in `app/[locale]/layout.tsx` inside `ClerkProvider` (required — it calls
`useAuth()` to get the Clerk token):

```tsx
// src/components/providers/ApiProvider.tsx ('use client')
import { PasseApiProvider } from '@passe/hooks/context'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuth } from '@clerk/nextjs'
```

### Using hooks in client components

```tsx
'use client'
import { useTrips, useCreateTrip } from '@passe/hooks'

export function TripList() {
  const { data: trips, isLoading, error } = useTrips()
  const createTrip = useCreateTrip()
  // ...
}
```

### Available hooks

| Hook | Wraps |
|---|---|
| `useUser()` | GET /api/user |
| `useUpdateUser()` | PATCH /api/user |
| `useTrips()` | GET /api/trips |
| `useTrip(id)` | GET /api/trips/[id] |
| `useCreateTrip()` | POST /api/trips |
| `useUpdateTrip()` | PATCH /api/trips/[id] |
| `useDeleteTrip()` | DELETE /api/trips/[id] |
| `useMemories(tripId)` | GET /api/trips/[id]/memories |
| `useAllMemories()` | GET /api/memories (all user memories) |
| `useCreateMemory()` | POST /api/trips/[id]/memories |
| `useUpdateMemory()` | PATCH /api/trips/[id]/memories/[id] |
| `useDeleteMemory()` | DELETE /api/trips/[id]/memories/[id] |

Mutation hooks auto-invalidate related query keys on success (e.g. `useDeleteTrip` invalidates
both `trips` list and the individual `trip` cache entry).

Import from `@passe/hooks` (barrel) or granular paths: `@passe/hooks/trips`, `@passe/hooks/user`,
`@passe/hooks/memories`.

---

## Storybook

Stories are **colocated with the component they document** — same folder, `ComponentName.stories.tsx`.
This follows the `packages/ui` convention and keeps the story adjacent to the implementation.

```bash
pnpm --filter passe-web storybook    # dev server at localhost:6006
pnpm --filter passe-web build-storybook
```

### Config

`.storybook/preview.tsx` provides two global decorators applied to every story:
- `NextIntlClientProvider` with `locale="en"` and the real `en.json` messages (imported from `packages/i18n`)
- `ThemeProvider` from next-themes (required for `useTheme()` in shared components)
- Also imports `src/styles/globals.css` so Tailwind v4 + brand theme CSS variables are available

`.storybook/main.ts` adds Vite aliases so Clerk and locale navigation don't crash in the browser:

| Module | Alias target |
|---|---|
| `@clerk/nextjs` | `.storybook/__mocks__/clerk.ts` |
| `@clerk/nextjs/errors` | `.storybook/__mocks__/clerk-errors.ts` |
| `@/i18n/navigation` | `.storybook/__mocks__/i18n-navigation.tsx` |

### Story conventions

- **Title**: `'Auth/<Name>'` for auth feature components, `'Shared/<Name>'` for shared components
- **tags**: always include `['autodocs']` to auto-generate the docs page
- **Decorators**: add a width-constraining wrapper (`w-80 mx-auto`) for form components to match their real layout context
- **Do not** write stories for pure provider/wrapper components (`ApiProvider`, `ThemeProvider`)

### Available stories

| Story | File |
|---|---|
| Auth/PasswordStrengthMeter | `src/features/auth/components/PasswordStrengthMeter.stories.tsx` |
| Auth/PasswordMatchIndicator | `src/features/auth/components/PasswordMatchIndicator.stories.tsx` |
| Auth/SocialAuthButtons | `src/features/auth/components/SocialAuthButtons.stories.tsx` |
| Auth/SignInForm | `src/features/auth/components/SignInForm.stories.tsx` |
| Auth/SignUpForm | `src/features/auth/components/SignUpForm.stories.tsx` |
| Auth/ForgotPasswordForm | `src/features/auth/components/ForgotPasswordForm.stories.tsx` |
| Auth/ResetPasswordForm | `src/features/auth/components/ResetPasswordForm.stories.tsx` |
| Auth/LogoutButton | `src/features/auth/components/LogoutButton.stories.tsx` |
| Shared/LocaleDropdownMenu | `src/components/shared/LocaleDropdownMenu.stories.tsx` |
| Shared/ThemeDropdownMenu | `src/components/shared/ThemeDropdownMenu.stories.tsx` |

---

## External documentation

- [Clerk Next.js quickstart](https://clerk.com/docs/quickstarts/nextjs)
- [clerkMiddleware (proxy.ts)](https://clerk.com/docs/references/nextjs/clerk-middleware)
- [auth() reference](https://clerk.com/docs/references/nextjs/auth)
- [currentUser() reference](https://clerk.com/docs/references/nextjs/current-user)
- [Next.js 16 docs](https://nextjs.org/docs)
