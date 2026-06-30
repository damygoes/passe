---
paths:
  - 'packages/types/src/**'
---

# Types Package Rules

## Zod-First Pattern

Every type MUST start from a Zod schema. TypeScript types are always inferred — never written by hand:

```ts
export const ThingSchema = z.object({ ... })
export type Thing = z.infer<typeof ThingSchema>
```

## Derived Schemas

Create derived schemas using Zod methods, not new `z.object({})` definitions:

```ts
// For creates — omit server-generated fields
export const CreateThingSchema = ThingSchema.omit({ id: true, createdAt: true, updatedAt: true })
export type CreateThing = z.infer<typeof CreateThingSchema>

// For updates — make all fields optional
export const UpdateThingSchema = CreateThingSchema.partial()
export type UpdateThing = z.infer<typeof UpdateThingSchema>

// For public views — pick only safe fields
export const PublicThingSchema = ThingSchema.pick({ id: true, name: true })
export type PublicThing = z.infer<typeof PublicThingSchema>
```

## Naming Conventions

- Schema: `ThingSchema` (PascalCase + Schema suffix)
- Type: `Thing` (PascalCase, no suffix)
- Enums: `StatusSchema = z.enum([...])` + `type Status = z.infer<typeof StatusSchema>`

## Date Handling

Always use `z.coerce.date()` for date fields — this handles ISO strings from JSON responses.

## Exports

Each domain file exports all schemas and types. `src/index.ts` re-exports everything with `export * from './thing'`. No named aggregation — keep it flat.

## No UI/Theme Dependencies

This package must remain framework-agnostic. Never import from `@passe/ui`, `@passe/theme`, or any `apps/*` package.
