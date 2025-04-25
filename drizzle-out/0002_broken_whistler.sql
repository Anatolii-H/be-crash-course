ALTER TABLE "comments" ALTER COLUMN "text" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "title" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "description" SET NOT NULL;