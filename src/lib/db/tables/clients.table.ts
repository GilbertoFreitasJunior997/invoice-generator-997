import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import {
	type ClientStatus,
	clientStatuses,
} from "@/lib/schemas/client-status.schemas";
import { type Country, countries } from "@/lib/schemas/countries.schemas";
import { createdAt, id, updatedAt, userId } from "@/lib/utils/db.utils";

export function getClientsColumns() {
	return {
		id: id(),

		name: text("name").notNull(),
		email: text("email"),
		taxId: text("tax_id"),

		addressLine1: text("address_line_1").notNull(),
		addressLine2: text("address_line_2"),
		city: text("city").notNull(),
		state: text("state").notNull(),
		country: text("country", {
			enum: countries as [Country, ...Country[]],
		}).notNull(),
		zip: text("zip").notNull(),

		status: text("status", {
			enum: clientStatuses as [ClientStatus, ...ClientStatus[]],
		}).notNull(),
	} as const;
}

export const clientsTable = sqliteTable("clients", {
	...getClientsColumns(),

	userId: userId(),

	createdAt: createdAt(),
	updatedAt: updatedAt(),
});
