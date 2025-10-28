import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createdAt, id, updatedAt, userId } from "@/lib/utils/db.utils";

export function getClientsColumns() {
	return {
		id: id(),

		name: text("name").notNull(),
		email: text("email"),
		currentInvoiceNumber: integer("current_invoice_number", { mode: "number" })
			.notNull()
			.default(1),

		taxId: text("tax_id"),

		addressLine1: text("address_line_1").notNull(),
		addressLine2: text("address_line_2"),
		city: text("city").notNull(),
		state: text("state").notNull(),
		country: text("country").notNull(),
		zip: text("zip").notNull(),
	} as const;
}

export const clientsTable = sqliteTable("clients", {
	...getClientsColumns(),

	userId: userId(),

	createdAt: createdAt(),
	updatedAt: updatedAt(),
});
