# @passe/hooks — API Hooks

TanStack Query v5 wrappers for all Passé data operations. Used by both `apps/web` and `apps/mobile`.

**No Next.js imports anywhere in this package** — it is framework-agnostic and safe for React Native.

---

## PasseApiProvider

All hooks depend on `PasseApiProvider` being mounted above them in the tree. It injects the base URL and auth token strategy, which differ per platform:

```tsx
// Web (apps/web) — same-origin, Clerk Next.js token
<PasseApiProvider baseUrl="" getToken={() => auth().then(a => a.getToken())}>
  {children}
</PasseApiProvider>

// Mobile (apps/mobile) — absolute URL, Clerk Expo token
const { getToken } = useAuth() // from @clerk/expo
<PasseApiProvider baseUrl={process.env.EXPO_PUBLIC_API_URL!} getToken={getToken}>
  {children}
</PasseApiProvider>
```

`PasseApiProvider` must be a descendant of both `ClerkProvider` (for `getToken`) and `QueryClientProvider` (for TanStack Query).

---

## Available Exports

```ts
// Provider + context
export { PasseApiProvider, usePasseApi }
export type { PasseApiContextValue }

// Query key factory
export { queryKeys }

// User
export { useUser, useUpdateUser, useDeleteAccount }

// Trips
export { useTrips, useTrip, useCreateTrip, useUpdateTrip, useDeleteTrip }

// Memories
export { useMemories, useAllMemories, useCreateMemory, useUpdateMemory, useDeleteMemory, useReorderMemories }

// Uploads
export { useUploadImage }
```

All data hooks must be called inside a component tree that has `PasseApiProvider` as an ancestor, otherwise they throw.

---

## Rules

- Never add Next.js-specific imports (`next/*`, `@clerk/nextjs`) — this package must stay framework-agnostic
- Never import `@passe/db` — hooks call HTTP API routes, not the database directly
- All mutations use `useMutation` and invalidate the relevant query keys on success
- Use `@passe/types` schemas to validate API responses within hook implementations
