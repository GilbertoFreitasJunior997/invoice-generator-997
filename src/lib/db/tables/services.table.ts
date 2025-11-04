import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { type Currency, currencies } from "@/lib/schemas/currency.schemas";
import {
	type ServiceStatus,
	serviceStatuses,
} from "@/lib/schemas/service-status.schemas";
import { createdAt, id, updatedAt, userId } from "@/lib/utils/db.utils";

export function getServicesColumns() {
	return {
		id: id(),

		name: text("name").notNull(),
		description: text("description").notNull(),
		rate: integer("rate", { mode: "number" }).notNull(),
		currency: text("currency", {
			enum: currencies as [Currency, ...Currency[]],
		}).notNull(),
		status: text("status", {
			enum: serviceStatuses as [ServiceStatus, ...ServiceStatus[]],
		}).notNull(),
	} as const;
}

export const servicesTable = sqliteTable("services", {
	...getServicesColumns(),

	userId: userId(),

	createdAt: createdAt(),
	updatedAt: updatedAt(),
});
