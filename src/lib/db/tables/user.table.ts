import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createdAt, id, updatedAt } from "@/lib/utils/tables.utils";

export function getUsersColumns() {
	return {
		id: id(),
		workOsId: text("work_os_id").notNull().unique(),
		email: text("email").notNull().unique(),
		name: text("name").notNull(),
		addressLine1: text("address_line_1").notNull(),
		addressLine2: text("address_line_2"),
		city: text("city").notNull(),
		state: text("state").notNull(),
		country: text("country").notNull(),
		avatarUrl: text("avatar_url").notNull(),

		createdAt: createdAt(),
		updatedAt: updatedAt(),
	} as const;
}

export const usersTable = sqliteTable("users", getUsersColumns());
