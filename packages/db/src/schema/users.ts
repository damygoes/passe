import { pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const planEnum = pgEnum('plan', ['free', 'explorer', 'collector'])
export const planSourceEnum = pgEnum('plan_source', ['stripe', 'revenuecat'])

export const users = pgTable('users', {
  id: text('id').primaryKey(), // Clerk user ID
  email: text('email').notNull().unique(),
  username: text('username').notNull().unique(),
  displayName: text('display_name').notNull(),
  bio: text('bio'),
  avatarUrl: text('avatar_url'),
  plan: planEnum('plan').notNull().default('free'),
  // Null while plan is 'free' — a free user has no billing source. Set
  // alongside `plan` by whichever webhook (Stripe or RevenueCat) wrote it.
  planSource: planSourceEnum('plan_source'),
  stripeCustomerId: text('stripe_customer_id').unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export type DbUser = typeof users.$inferSelect
export type DbNewUser = typeof users.$inferInsert
