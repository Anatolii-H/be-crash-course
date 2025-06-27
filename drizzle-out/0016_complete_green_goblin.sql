CREATE TYPE "public"."user_role" AS ENUM('admin', 'user');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" "user_role" DEFAULT 'user' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_disabled" boolean DEFAULT false NOT NULL;