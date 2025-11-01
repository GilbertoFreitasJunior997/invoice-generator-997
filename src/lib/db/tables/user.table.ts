import {
	integer,
	sqliteTable,
	text,
	uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { type Country, countries } from "@/lib/schemas/countries.schemas";
import { createdAt, id, updatedAt } from "@/lib/utils/db.utils";

export function getUsersColumns() {
	return {
		id: id(),

		name: text("name").notNull(),
		avatarUrl: text("avatar_url").notNull(),
		email: text("email").notNull(),

		currentInvoiceNumber: integer("current_invoice_number", { mode: "number" })
			.notNull()
			.default(1),

		taxId: text("tax_id"),

		addressLine1: text("address_line_1").notNull(),
		addressLine2: text("address_line_2"),
		city: text("city").notNull(),
		state: text("state").notNull(),
		country: text("country", {
			enum: countries as [Country, ...Country[]],
		}).notNull(),
		zip: text("zip").notNull(),
	} as const;
}

export const usersTable = sqliteTable(
	"users",
	{
		...getUsersColumns(),

		workOsId: text("work_os_id").notNull().unique(),

		createdAt: createdAt(),
		updatedAt: updatedAt(),
	},
	(table) => [uniqueIndex("unique_email").on(table.email)],
);
