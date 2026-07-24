import { pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const planEnum = pgEnum('plan', ['free', 'explorer', 'collector'])

// Visual theme for the user's editorial surfaces (trip pages, public portfolio).
// 'editorial' is the default brand look; 'scrapbook' is the Explorer+ opt-in.
export const userThemeEnum = pgEnum('user_theme', ['editorial', 'scrapbook'])

export const users = pgTable('users', {
  id: text('id').primaryKey(), // Clerk user ID
  email: text('email').notNull().unique(),
  username: text('username').notNull().unique(),
  displayName: text('display_name').notNull(),
  bio: text('bio'),
  avatarUrl: text('avatar_url'),
  plan: planEnum('plan').notNull().default('free'),
  theme: userThemeEnum('theme').notNull().default('editorial'),
  stripeCustomerId: text('stripe_customer_id').unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export type DbUser = typeof users.$inferSelect
export type DbNewUser = typeof users.$inferInsert
