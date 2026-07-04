import { sql } from 'drizzle-orm'
import { boolean, index, pgTable, real, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { trips } from './trips'
import { users } from './users'

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
    capturedAt: timestamp('captured_at').notNull(),
    isPublic: boolean('is_public').notNull().default(false),
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
