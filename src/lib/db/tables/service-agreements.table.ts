import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createdAt, id, updatedAt, userId } from "@/lib/utils/tables.utils";
import { clientsTable } from "./clients.table";

export const serviceAgreementStatusEnum = ["active", "inactive"] as const;

export function getServiceAgreementsColumns() {
	return {
		id: id(),

		title: text("title").notNull(),
		description: text("description"),
		rateAmount: text("rate_amount").notNull(),
		rateCurrency: text("rate_currency").notNull(),
		status: text("status", { enum: serviceAgreementStatusEnum }).notNull(),

		nextInvoiceNumber: integer("next_invoice_number").notNull().default(1),

		userId: userId(),
		clientId: text("client_id")
			.notNull()
			.references(() => clientsTable.id),

		createdAt: createdAt(),
		updatedAt: updatedAt(),
	} as const;
}

export const serviceAgreementsTable = sqliteTable(
	"service_agreements",
	getServiceAgreementsColumns(),
);
