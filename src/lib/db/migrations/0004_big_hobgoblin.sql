DROP INDEX "invoices_invoice_number_unique";--> statement-breakpoint
DROP INDEX "user_snapshots_work_os_id_unique";--> statement-breakpoint
DROP INDEX "user_snapshots_email_unique";--> statement-breakpoint
DROP INDEX "users_work_os_id_unique";--> statement-breakpoint
DROP INDEX "users_email_unique";--> statement-breakpoint
ALTER TABLE `service_agreements_snapshots` ALTER COLUMN "status" TO "status" text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `invoices_invoice_number_unique` ON `invoices` (`invoice_number`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_snapshots_work_os_id_unique` ON `user_snapshots` (`work_os_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_snapshots_email_unique` ON `user_snapshots` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_work_os_id_unique` ON `users` (`work_os_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
ALTER TABLE `service_agreements_snapshots` DROP COLUMN `rate_type`;--> statement-breakpoint
ALTER TABLE `service_agreements_snapshots` DROP COLUMN `start_date`;--> statement-breakpoint
ALTER TABLE `service_agreements_snapshots` DROP COLUMN `end_date`;--> statement-breakpoint
ALTER TABLE `service_agreements` ALTER COLUMN "status" TO "status" text NOT NULL;--> statement-breakpoint
ALTER TABLE `service_agreements` DROP COLUMN `rate_type`;--> statement-breakpoint
ALTER TABLE `service_agreements` DROP COLUMN `start_date`;--> statement-breakpoint
ALTER TABLE `service_agreements` DROP COLUMN `end_date`;