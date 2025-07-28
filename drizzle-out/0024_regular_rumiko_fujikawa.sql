ALTER TABLE "archived_users" RENAME TO "archive";--> statement-breakpoint
ALTER TABLE "archive" ADD COLUMN "entity_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "archive" ADD CONSTRAINT "archive_entityId_unique" UNIQUE("entity_id");