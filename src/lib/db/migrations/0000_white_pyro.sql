CREATE TABLE `client_history` (
	`id` text PRIMARY KEY NOT NULL,
	`client_id` text NOT NULL,
	`company_name` text,
	`contact_person` text,
	`email` text,
	`phone` text,
	`address_line_1` text,
	`address_line_2` text,
	`city` text,
	`state` text,
	`postal_code` text,
	`country` text,
	`valid_from` integer NOT NULL,
	`valid_to` integer,
	`change_reason` text,
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `client_snapshots` (
	`id` text PRIMARY KEY NOT NULL,
	`company_name` text NOT NULL,
	`contact_person` text,
	`email` text,
	`phone` text,
	`address_line_1` text,
	`address_line_2` text,
	`city` text,
	`state` text,
	`postal_code` text,
	`country` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`client_id` text NOT NULL,
	`snapshot_date` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `clients` (
	`id` text PRIMARY KEY NOT NULL,
	`company_name` text NOT NULL,
	`contact_person` text,
	`email` text,
	`phone` text,
	`address_line_1` text,
	`address_line_2` text,
	`city` text,
	`state` text,
	`postal_code` text,
	`country` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `invoices` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`client_id` text NOT NULL,
	`service_agreement_id` text,
	`user_snapshot_id` text NOT NULL,
	`client_snapshot_id` text NOT NULL,
	`invoice_number` text NOT NULL,
	`issue_date` integer NOT NULL,
	`due_date` integer NOT NULL,
	`amount` text NOT NULL,
	`currency` text NOT NULL,
	`description` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`notes` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`service_agreement_id`) REFERENCES `service_agreements`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_snapshot_id`) REFERENCES `user_snapshots`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`client_snapshot_id`) REFERENCES `client_snapshots`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `invoices_invoice_number_unique` ON `invoices` (`invoice_number`);--> statement-breakpoint
CREATE TABLE `service_agreement_history` (
	`id` text PRIMARY KEY NOT NULL,
	`service_agreement_id` text NOT NULL,
	`title` text,
	`description` text,
	`rate_amount` text,
	`rate_currency` text,
	`rate_type` text,
	`status` text,
	`start_date` integer,
	`end_date` integer,
	`valid_from` integer NOT NULL,
	`valid_to` integer,
	`change_reason` text,
	FOREIGN KEY (`service_agreement_id`) REFERENCES `service_agreements`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `service_agreements` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`client_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`rate_amount` text NOT NULL,
	`rate_currency` text NOT NULL,
	`rate_type` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`start_date` integer,
	`end_date` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user_history` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text,
	`email` text,
	`phone` text,
	`address_line_1` text,
	`address_line_2` text,
	`city` text,
	`state` text,
	`postal_code` text,
	`country` text,
	`tax_id` text,
	`valid_from` integer NOT NULL,
	`valid_to` integer,
	`change_reason` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user_snapshots` (
	`id` text PRIMARY KEY NOT NULL,
	`work_os_id` text NOT NULL,
	`email` text NOT NULL,
	`name` text,
	`phone` text,
	`address_line_1` text,
	`address_line_2` text,
	`city` text,
	`state` text,
	`postal_code` text,
	`country` text,
	`tax_id` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`user_id` text NOT NULL,
	`snapshot_date` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_snapshots_work_os_id_unique` ON `user_snapshots` (`work_os_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_snapshots_email_unique` ON `user_snapshots` (`email`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`work_os_id` text NOT NULL,
	`email` text NOT NULL,
	`name` text,
	`phone` text,
	`address_line_1` text,
	`address_line_2` text,
	`city` text,
	`state` text,
	`postal_code` text,
	`country` text,
	`tax_id` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_work_os_id_unique` ON `users` (`work_os_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);