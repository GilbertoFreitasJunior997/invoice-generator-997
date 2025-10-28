import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { snapshotDate } from "@/lib/utils/db.utils";
import { invoicesTable } from "./invoices.table";
import { getServicesColumns } from "./services.table";

export const invoiceItemsTable = sqliteTable("invoice_items", {
	...getServicesColumns(),

	quantity: integer("quantity", { mode: "number" }).notNull(),

	invoiceId: text("invoice_id")
		.notNull()
		.references(() => invoicesTable.id, {
			onDelete: "cascade",
			onUpdate: "cascade",
		}),

	snapshotDate: snapshotDate(),
});
