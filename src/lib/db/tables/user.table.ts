import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createdAt, id, updatedAt } from "@/lib/utils/tables.utils";

export function getUsersColumns() {
	return {
		id: id(),
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
