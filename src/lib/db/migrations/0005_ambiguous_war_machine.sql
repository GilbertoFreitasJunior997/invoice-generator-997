PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_client_snapshots` (
	`id` text PRIMARY KEY NOT NULL,
	`company_name` text NOT NULL,
	`address_line_1` text NOT NULL,
	`address_line_2` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`client_id` text NOT NULL,
	`snapshot_date` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_client_snapshots`("id", "company_name", "address_line_1", "address_line_2", "user_id", "created_at", "updated_at", "client_id", "snapshot_date") SELECT "id", "company_name", "address_line_1", "address_line_2", "user_id", "created_at", "updated_at", "client_id", "snapshot_date" FROM `client_snapshots`;--> statement-breakpoint
DROP TABLE `client_snapshots`;--> statement-breakpoint
ALTER TABLE `__new_client_snapshots` RENAME TO `client_snapshots`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_clients` (
	`id` text PRIMARY KEY NOT NULL,
	`company_name` text NOT NULL,
	`address_line_1` text NOT NULL,
	`address_line_2` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_clients`("id", "company_name", "address_line_1", "address_line_2", "user_id", "created_at", "updated_at") SELECT "id", "company_name", "address_line_1", "address_line_2", "user_id", "created_at", "updated_at" FROM `clients`;--> statement-breakpoint
DROP TABLE `clients`;--> statement-breakpoint
ALTER TABLE `__new_clients` RENAME TO `clients`;--> statement-breakpoint
CREATE TABLE `__new_invoices` (
	`id` text PRIMARY KEY NOT NULL,
	`invoice_number` text NOT NULL,
	`issue_date` integer NOT NULL,
	`amount` text NOT NULL,
	`currency` text NOT NULL,
	`description` text,
	`user_id` text NOT NULL,
	`client_id` text NOT NULL,
	`service_agreement_id` text,
	`user_snapshot_id` text NOT NULL,
	`client_snapshot_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`service_agreement_id`) REFERENCES `service_agreements`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_snapshot_id`) REFERENCES `user_snapshots`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`client_snapshot_id`) REFERENCES `client_snapshots`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_invoices`("id", "invoice_number", "issue_date", "amount", "currency", "description", "user_id", "client_id", "service_agreement_id", "user_snapshot_id", "client_snapshot_id", "created_at", "updated_at") SELECT "id", "invoice_number", "issue_date", "amount", "currency", "description", "user_id", "client_id", "service_agreement_id", "user_snapshot_id", "client_snapshot_id", "created_at", "updated_at" FROM `invoices`;--> statement-breakpoint
DROP TABLE `invoices`;--> statement-breakpoint
ALTER TABLE `__new_invoices` RENAME TO `invoices`;--> statement-breakpoint
CREATE UNIQUE INDEX `invoices_invoice_number_unique` ON `invoices` (`invoice_number`);--> statement-breakpoint
CREATE TABLE `__new_service_agreements_snapshots` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`rate_amount` text NOT NULL,
	`rate_currency` text NOT NULL,
	`status` text NOT NULL,
	`next_invoice_number` integer DEFAULT 1 NOT NULL,
	`user_id` text NOT NULL,
	`client_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`service_agreement_id` text NOT NULL,
	`snapshot_date` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`service_agreement_id`) REFERENCES `service_agreements`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_service_agreements_snapshots`("id", "title", "description", "rate_amount", "rate_currency", "status", "next_invoice_number", "user_id", "client_id", "created_at", "updated_at", "service_agreement_id", "snapshot_date") SELECT "id", "title", "description", "rate_amount", "rate_currency", "status", "next_invoice_number", "user_id", "client_id", "created_at", "updated_at", "service_agreement_id", "snapshot_date" FROM `service_agreements_snapshots`;--> statement-breakpoint
DROP TABLE `service_agreements_snapshots`;--> statement-breakpoint
ALTER TABLE `__new_service_agreements_snapshots` RENAME TO `service_agreements_snapshots`;--> statement-breakpoint
CREATE TABLE `__new_service_agreements` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`rate_amount` text NOT NULL,
	`rate_currency` text NOT NULL,
	`status` text NOT NULL,
	`next_invoice_number` integer DEFAULT 1 NOT NULL,
	`user_id` text NOT NULL,
	`client_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_service_agreements`("id", "title", "description", "rate_amount", "rate_currency", "status", "next_invoice_number", "user_id", "client_id", "created_at", "updated_at") SELECT "id", "title", "description", "rate_amount", "rate_currency", "status", "next_invoice_number", "user_id", "client_id", "created_at", "updated_at" FROM `service_agreements`;--> statement-breakpoint
DROP TABLE `service_agreements`;--> statement-breakpoint
ALTER TABLE `__new_service_agreements` RENAME TO `service_agreements`;