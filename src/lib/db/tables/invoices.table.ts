import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createdAt, id, updatedAt } from "@/lib/utils/db.utils";
import { clientSnapshotsTable } from "./client-snapshots.table";
import { userSnapshotsTable } from "./user-snapshots.table";

export const invoicesTable = sqliteTable("invoices", {
	id: id(),

	invoiceNumber: text("invoice_number").notNull().unique(),
	issueDate: integer("issue_date", { mode: "timestamp" }).notNull(),
	amount: text("amount").notNull(),
	currency: text("currency").notNull(),

	description: text("description"),

	userSnapshotId: text("user_snapshot_id")
		.notNull()
		.references(() => userSnapshotsTable.id),
	clientSnapshotId: text("client_snapshot_id")
		.notNull()
		.references(() => clientSnapshotsTable.id),

	createdAt: createdAt(),
	updatedAt: updatedAt(),
});
