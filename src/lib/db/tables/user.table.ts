import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createdAt, id, updatedAt } from "@/lib/utils/db.utils";

export function getUsersColumns() {
	return {
		id: id(),

		name: text("name").notNull(),
		avatarUrl: text("avatar_url").notNull(),
		email: text("email").notNull().unique(),

		taxId: text("tax_id"),

		addressLine1: text("address_line_1").notNull(),
		addressLine2: text("address_line_2"),
		city: text("city").notNull(),
		state: text("state").notNull(),
		country: text("country").notNull(),
		zip: text("zip").notNull(),
	} as const;
}

export const usersTable = sqliteTable("users", {
	...getUsersColumns(),

	workOsId: text("work_os_id").notNull().unique(),

	createdAt: createdAt(),
	updatedAt: updatedAt(),
});
