DROP INDEX "users_work_os_id_unique";--> statement-breakpoint
DROP INDEX "unique_email";--> statement-breakpoint
ALTER TABLE `user_snapshots` ALTER COLUMN "current_invoice_number" TO "current_invoice_number" integer NOT NULL DEFAULT 0;--> statement-breakpoint
CREATE UNIQUE INDEX `users_work_os_id_unique` ON `users` (`work_os_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `unique_email` ON `users` (`email`);--> statement-breakpoint
ALTER TABLE `users` ALTER COLUMN "current_invoice_number" TO "current_invoice_number" integer NOT NULL DEFAULT 0;--> statement-breakpoint
ALTER TABLE `invoices` ADD `due_date` text;