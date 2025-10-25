CREATE TABLE `service_agreement_items_snapshots` (
	`id` text PRIMARY KEY NOT NULL,
	`description` text NOT NULL,
	`rate` integer NOT NULL,
	`currency` text NOT NULL,
	`user_id` text NOT NULL,
	`service_agreement_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`service_agreement_item_id` text NOT NULL,
	`snapshot_date` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`service_agreement_id`) REFERENCES `service_agreements`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`service_agreement_item_id`) REFERENCES `service_agreement_items`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `service_agreement_items` (
	`id` text PRIMARY KEY NOT NULL,
	`description` text NOT NULL,
	`rate` integer NOT NULL,
	`currency` text NOT NULL,
	`user_id` text NOT NULL,
	`service_agreement_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`service_agreement_id`) REFERENCES `service_agreements`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `service_agreements_snapshots` DROP COLUMN `description`;--> statement-breakpoint
ALTER TABLE `service_agreements_snapshots` DROP COLUMN `rate_amount`;--> statement-breakpoint
ALTER TABLE `service_agreements_snapshots` DROP COLUMN `rate_currency`;--> statement-breakpoint
ALTER TABLE `service_agreements` DROP COLUMN `description`;--> statement-breakpoint
ALTER TABLE `service_agreements` DROP COLUMN `rate_amount`;--> statement-breakpoint
ALTER TABLE `service_agreements` DROP COLUMN `rate_currency`;