CREATE TYPE "public"."layout_variant" AS ENUM('auto', 'hero', 'image_left', 'image_right', 'carousel', 'text');--> statement-breakpoint
ALTER TABLE "memories" ADD COLUMN "layout_variant" "layout_variant" DEFAULT 'auto' NOT NULL;--> statement-breakpoint
ALTER TABLE "memories" ADD COLUMN "sort_order" integer;