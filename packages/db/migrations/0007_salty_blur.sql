ALTER TABLE "memories" ADD COLUMN "place_name" text;--> statement-breakpoint
ALTER TABLE "memories" ADD COLUMN "tags" text[] DEFAULT '{}'::text[] NOT NULL;