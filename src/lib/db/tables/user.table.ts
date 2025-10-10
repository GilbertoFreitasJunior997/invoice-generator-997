import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createdAt, updatedAt } from "@/lib/utils/tables.utils";

export function getUsersColumns() {
	return {
		id: text("id").primaryKey(),
		workOsId: text("work_os_id").notNull().unique(),
		email: text("email").notNull().unique(),
		name: text("name"),
		addressLine1: text("address_line_1"),
		addressLine2: text("address_line_2"),

		createdAt: createdAt(),
		updatedAt: updatedAt(),
	} as const;
}

export const usersTable = sqliteTable("users", getUsersColumns());
