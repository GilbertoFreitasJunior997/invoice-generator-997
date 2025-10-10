import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createdAt, updatedAt } from "@/lib/utils/tables.utils";
import { usersTable } from "./user.table";

export function getClientsColumns() {
	return {
		id: text("id").primaryKey(),
		companyName: text("company_name").notNull(),
		addressLine1: text("address_line_1").notNull(),
		addressLine2: text("address_line_2").notNull(),

		userId: text("user_id")
			.notNull()
			.references(() => usersTable.id),

		createdAt: createdAt(),
		updatedAt: updatedAt(),
	} as const;
}

export const clientsTable = sqliteTable("clients", getClientsColumns());
