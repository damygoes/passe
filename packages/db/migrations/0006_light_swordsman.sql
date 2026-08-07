CREATE TYPE "public"."plan_source" AS ENUM('stripe', 'revenuecat');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "plan_source" "plan_source";