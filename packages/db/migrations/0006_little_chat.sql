CREATE TYPE "public"."user_theme" AS ENUM('editorial', 'scrapbook');--> statement-breakpoint
ALTER TYPE "public"."layout_variant" ADD VALUE 'polaroid';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "theme" "user_theme" DEFAULT 'editorial' NOT NULL;