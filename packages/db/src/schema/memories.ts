import { sql } from 'drizzle-orm'
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  real,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'
import { trips } from './trips'
import { users } from './users'

// How a memory renders on the editorial trip page. 'auto' lets the layout
// engine pick; the rest are explicit per-section user overrides.
export const layoutVariantEnum = pgEnum('layout_variant', [
  'auto',
  'hero',
  'image_left',
  'image_right',
  'carousel',
  'text',
])

export const memories = pgTable(
  'memories',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    tripId: uuid('trip_id')
      .notNull()
      .references(() => trips.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    note: text('note'),
    lat: real('lat'),
    lng: real('lng'),
    city: text('city'),
    country: text('country'),
    // Freeform street-level address (e.g. "Rue Bin Souaki, Chefchaouen").
    // Owner-only — never rendered on public pages, unlike city/country.
    placeName: text('place_name'),
    tags: text('tags')
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    capturedAt: timestamp('captured_at').notNull(),
    isPublic: boolean('is_public').notNull().default(false),
    layoutVariant: layoutVariantEnum('layout_variant').notNull().default('auto'),
    // Explicit position on the editorial page; null = chronological (auto)
    sortOrder: integer('sort_order'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [index('memories_trip_id_idx').on(t.tripId), index('memories_user_id_idx').on(t.userId)],
)

export type DbMemory = typeof memories.$inferSelect
export type DbNewMemory = typeof memories.$inferInsert
