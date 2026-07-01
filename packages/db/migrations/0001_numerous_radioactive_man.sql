ALTER TABLE "trips" ALTER COLUMN "is_public" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "memories" ADD COLUMN "is_public" boolean DEFAULT false NOT NULL;