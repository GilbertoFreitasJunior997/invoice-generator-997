import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createdAt, id, updatedAt } from "@/lib/utils/tables.utils";
import { clientsTable } from "./clients.table";
import { usersTable } from "./user.table";

export const rateTypeEnum = ["hourly", "fixed", "monthly"] as const;
export const serviceAgreementStatusEnum = [
	"draft",
	"active",
	"inactive",
] as const;

export function getServiceAgreementsColumns() {
	return {
		id: id(),

		description: text("description"),
		rateAmount: text("rate_amount").notNull(),
		rateCurrency: text("rate_currency").notNull(),
		rateType: text("rate_type", { enum: rateTypeEnum }).notNull(),
		status: text("status", { enum: serviceAgreementStatusEnum })
			.notNull()
			.default("draft"),
		startDate: integer("start_date", { mode: "timestamp" }),
		endDate: integer("end_date", { mode: "timestamp" }),
		nextInvoiceNumber: integer("next_invoice_number").notNull().default(1),

		userId: text("user_id")
			.notNull()
			.references(() => usersTable.id),
		clientId: text("client_id")
			.notNull()
			.references(() => clientsTable.id),
		title: text("title").notNull(),

		createdAt: createdAt(),
		updatedAt: updatedAt(),
	} as const;
}

export const serviceAgreementsTable = sqliteTable(
	"service_agreements",
	getServiceAgreementsColumns(),
);
