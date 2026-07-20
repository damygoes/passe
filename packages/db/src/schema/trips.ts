import { sql } from 'drizzle-orm'
import { boolean, index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { users } from './users'

export const trips = pgTable(
  'trips',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description'),
    coverImageUrl: text('cover_image_url'),
    // Tiny base64 JPEG data URI (blur-up placeholder), generated server-side
    // from the uploaded original. Null for legacy Cloudinary rows and trips
    // created before this column existed — no backfill.
    coverImagePlaceholder: text('cover_image_placeholder'),
    countries: text('countries')
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    startDate: timestamp('start_date').notNull(),
    endDate: timestamp('end_date').notNull(),
    isPublic: boolean('is_public').notNull().default(false),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [index('trips_user_id_idx').on(t.userId)],
)

export type DbTrip = typeof trips.$inferSelect
export type DbNewTrip = typeof trips.$inferInsert
