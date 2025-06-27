CREATE INDEX "user_first_name_trgm_index" ON "users" USING gin ("first_name" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "user_last_name_trgm_index" ON "users" USING gin ("last_name" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "user_email_trgm_index" ON "users" USING gin ("email" gin_trgm_ops);