CREATE TYPE "public"."media_type" AS ENUM('photo', 'video');--> statement-breakpoint
CREATE TABLE "memory_media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"memory_id" uuid NOT NULL,
	"url" text NOT NULL,
	"media_type" "media_type" DEFAULT 'photo' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"width" integer,
	"height" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "memory_media" ADD CONSTRAINT "memory_media_memory_id_memories_id_fk" FOREIGN KEY ("memory_id") REFERENCES "public"."memories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "memory_media_memory_id_idx" ON "memory_media" USING btree ("memory_id");--> statement-breakpoint
INSERT INTO "memory_media" ("memory_id", "url")
SELECT "id", "photo_url" FROM "memories" WHERE "photo_url" IS NOT NULL;--> statement-breakpoint
ALTER TABLE "memories" DROP COLUMN "photo_url";