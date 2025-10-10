CREATE TABLE `service_agreements_snapshots` (
	`id` text PRIMARY KEY NOT NULL,
	`description` text,
	`rate_amount` text NOT NULL,
	`rate_currency` text NOT NULL,
	`rate_type` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`start_date` integer,
	`end_date` integer,
	`next_invoice_number` integer DEFAULT 1 NOT NULL,
	`user_id` text NOT NULL,
	`client_id` text NOT NULL,
	`title` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`service_agreement_id` text NOT NULL,
	`snapshot_date` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`service_agreement_id`) REFERENCES `service_agreements`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
DROP TABLE `client_history`;--> statement-breakpoint
DROP TABLE `service_agreement_history`;--> statement-breakpoint
DROP TABLE `user_history`;--> statement-breakpoint
DROP INDEX "invoices_invoice_number_unique";--> statement-breakpoint
DROP INDEX "user_snapshots_work_os_id_unique";--> statement-breakpoint
DROP INDEX "user_snapshots_email_unique";--> statement-breakpoint
DROP INDEX "users_work_os_id_unique";--> statement-breakpoint
DROP INDEX "users_email_unique";--> statement-breakpoint
ALTER TABLE `client_snapshots` ALTER COLUMN "address_line_1" TO "address_line_1" text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `invoices_invoice_number_unique` ON `invoices` (`invoice_number`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_snapshots_work_os_id_unique` ON `user_snapshots` (`work_os_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_snapshots_email_unique` ON `user_snapshots` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_work_os_id_unique` ON `users` (`work_os_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
ALTER TABLE `client_snapshots` ALTER COLUMN "address_line_2" TO "address_line_2" text NOT NULL;--> statement-breakpoint
ALTER TABLE `client_snapshots` ADD `user_id` text NOT NULL REFERENCES users(id);--> statement-breakpoint
ALTER TABLE `client_snapshots` DROP COLUMN `contact_person`;--> statement-breakpoint
ALTER TABLE `client_snapshots` DROP COLUMN `email`;--> statement-breakpoint
ALTER TABLE `client_snapshots` DROP COLUMN `phone`;--> statement-breakpoint
ALTER TABLE `client_snapshots` DROP COLUMN `city`;--> statement-breakpoint
ALTER TABLE `client_snapshots` DROP COLUMN `state`;--> statement-breakpoint
ALTER TABLE `client_snapshots` DROP COLUMN `postal_code`;--> statement-breakpoint
ALTER TABLE `client_snapshots` DROP COLUMN `country`;--> statement-breakpoint
ALTER TABLE `clients` ALTER COLUMN "address_line_1" TO "address_line_1" text NOT NULL;--> statement-breakpoint
ALTER TABLE `clients` ALTER COLUMN "address_line_2" TO "address_line_2" text NOT NULL;--> statement-breakpoint
ALTER TABLE `clients` ADD `user_id` text NOT NULL REFERENCES users(id);--> statement-breakpoint
ALTER TABLE `clients` DROP COLUMN `contact_person`;--> statement-breakpoint
ALTER TABLE `clients` DROP COLUMN `email`;--> statement-breakpoint
ALTER TABLE `clients` DROP COLUMN `phone`;--> statement-breakpoint
ALTER TABLE `clients` DROP COLUMN `city`;--> statement-breakpoint
ALTER TABLE `clients` DROP COLUMN `state`;--> statement-breakpoint
ALTER TABLE `clients` DROP COLUMN `postal_code`;--> statement-breakpoint
ALTER TABLE `clients` DROP COLUMN `country`;--> statement-breakpoint
ALTER TABLE `service_agreements` ADD `next_invoice_number` integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `invoices` DROP COLUMN `due_date`;--> statement-breakpoint
ALTER TABLE `invoices` DROP COLUMN `status`;--> statement-breakpoint
ALTER TABLE `invoices` DROP COLUMN `notes`;--> statement-breakpoint
ALTER TABLE `user_snapshots` DROP COLUMN `phone`;--> statement-breakpoint
ALTER TABLE `user_snapshots` DROP COLUMN `city`;--> statement-breakpoint
ALTER TABLE `user_snapshots` DROP COLUMN `state`;--> statement-breakpoint
ALTER TABLE `user_snapshots` DROP COLUMN `postal_code`;--> statement-breakpoint
ALTER TABLE `user_snapshots` DROP COLUMN `country`;--> statement-breakpoint
ALTER TABLE `user_snapshots` DROP COLUMN `tax_id`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `phone`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `city`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `state`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `postal_code`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `country`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `tax_id`;