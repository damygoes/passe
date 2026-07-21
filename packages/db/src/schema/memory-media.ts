import { relations, sql } from 'drizzle-orm'
import { index, integer, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { memories } from './memories'

export const mediaTypeEnum = pgEnum('media_type', ['photo', 'video'])

export const memoryMedia = pgTable(
  'memory_media',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    memoryId: uuid('memory_id')
      .notNull()
      .references(() => memories.id, { onDelete: 'cascade' }),
    url: text('url').notNull(),
    mediaType: mediaTypeEnum('media_type').notNull().default('photo'),
    sortOrder: integer('sort_order').notNull().default(0),
    // Intrinsic dimensions reported by the upload provider — used later for
    // aspect-ratio-aware layout. Nullable because older uploads may lack them.
    width: integer('width'),
    height: integer('height'),
    // Tiny base64 JPEG data URI (blur-up placeholder), generated server-side
    // from the uploaded original. Null for legacy Cloudinary rows and media
    // created before this column existed — no backfill.
    placeholder: text('placeholder'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (t) => [index('memory_media_memory_id_idx').on(t.memoryId)],
)

// Both relations live here (not in memories.ts) to keep the import graph
// acyclic: this file imports memories, never the other way around.
export const memoryMediaRelations = relations(memoryMedia, ({ one }) => ({
  memory: one(memories, { fields: [memoryMedia.memoryId], references: [memories.id] }),
}))

export const memoriesRelations = relations(memories, ({ many }) => ({
  media: many(memoryMedia),
}))

export type DbMemoryMedia = typeof memoryMedia.$inferSelect
export type DbNewMemoryMedia = typeof memoryMedia.$inferInsert
