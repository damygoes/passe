---
paths:
  - 'apps/mobile/**'
---

# Mobile App Rules (Expo Router + React Native)

## React Native Primitives

- Use React Native primitives only: `View`, `Text`, `Pressable`, `ScrollView`, `FlatList`, `TextInput` — never HTML elements (`div`, `span`, `button`, `img`, etc.)
- Never use `document`, `window`, or any browser API — they do not exist in React Native

## Styling

- All styles via `StyleSheet.create()` defined at the bottom of the file — never use recurring raw inline style objects as a pattern
- Never use `cn()` — there are no Tailwind class strings on mobile
- Always source colors, spacing, typography, and borderRadius from `useTheme()` from `@/hooks/useTheme`:

```tsx
const { colors, spacing, typography } = useTheme()
```

## Images

- Use `expo-image` (`import { Image } from 'expo-image'`) — never raw `<img>` or React Native's built-in `Image` component

## Navigation

- Navigation via Expo Router only: `Link` component, `useRouter()`, `useLocalSearchParams()`, `usePathname()`
- Never import React Navigation directly (`@react-navigation/*`) — Expo Router wraps it
- Route files under `src/app/` are **routing only** — one-line shells that render a screen component from `src/features/`

## Authentication

- Auth via `@clerk/expo`: `useAuth()`, `useUser()`, `ClerkProvider`
- Never import from `@clerk/nextjs` or `@clerk/nextjs/server` — those are Next.js-only

## Data Fetching

- All API access via `@passe/hooks` (wrapped by `PasseApiProvider` in root layout)
- Never fetch data directly in route files (`src/app/**`) or in presentational components
- Never import or use `@passe/db`

## Package Import Rules

- **Never import `@passe/ui`** — it is DOM-based and will not run in React Native
- **Never import `@passe/db`** — server/Node.js only
- **Never import `@passe/theme/styles`** — CSS file, web-only. Use JS token exports: `import { colors } from '@passe/theme'`
- **Never import `@passe/auth` (barrel)** — it re-exports the webhook handler which imports `@passe/db`. Use subpaths only:
  - `@passe/auth/plan-gates` ✓
  - `@passe/auth/types` ✓
  - `@passe/auth/constants` ✓

## Feature Architecture

- Screen components live in `src/features/<feature>/screens/<Name>Screen.tsx`
- Shared native UI components live in `src/components/<name>/<Name>.tsx`
- Layout wrappers live in `src/components/layouts/<Name>Layout.tsx`
- `src/app/` is routing only — no component logic, hooks, or data fetching

## Code Conventions

- Named exports for all components and utilities
- Screens exported as named exports from feature directories; **route files** use a default export (Expo Router requirement)
- Full domain names in array callbacks: `.map(trip => ...)` not `.map(t => ...)`
- `@/` alias resolves to `src/` — use it for all intra-app imports
