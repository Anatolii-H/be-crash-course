ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "invite_status" text DEFAULT 'accepted' NOT NULL;