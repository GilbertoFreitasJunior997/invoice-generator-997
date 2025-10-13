DROP INDEX "invoices_invoice_number_unique";--> statement-breakpoint
DROP INDEX "user_snapshots_work_os_id_unique";--> statement-breakpoint
DROP INDEX "user_snapshots_email_unique";--> statement-breakpoint
DROP INDEX "users_work_os_id_unique";--> statement-breakpoint
DROP INDEX "users_email_unique";--> statement-breakpoint
ALTER TABLE `user_snapshots` ALTER COLUMN "name" TO "name" text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `invoices_invoice_number_unique` ON `invoices` (`invoice_number`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_snapshots_work_os_id_unique` ON `user_snapshots` (`work_os_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_snapshots_email_unique` ON `user_snapshots` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_work_os_id_unique` ON `users` (`work_os_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
ALTER TABLE `user_snapshots` ALTER COLUMN "address_line_1" TO "address_line_1" text NOT NULL;--> statement-breakpoint
ALTER TABLE `user_snapshots` ADD `city` text NOT NULL;--> statement-breakpoint
ALTER TABLE `user_snapshots` ADD `state` text NOT NULL;--> statement-breakpoint
ALTER TABLE `user_snapshots` ADD `country` text NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ALTER COLUMN "name" TO "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ALTER COLUMN "address_line_1" TO "address_line_1" text NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `city` text NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `state` text NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `country` text NOT NULL;