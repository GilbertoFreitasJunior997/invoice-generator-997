import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createdAt, id, updatedAt, userId } from "@/lib/utils/db.utils";

export function getClientsColumns() {
	return {
		id: id(),
		companyName: text("company_name").notNull(),
		addressLine1: text("address_line_1").notNull(),
		addressLine2: text("address_line_2").notNull(),

		userId: userId(),

		createdAt: createdAt(),
		updatedAt: updatedAt(),
	} as const;
}

export const clientsTable = sqliteTable("clients", getClientsColumns());
