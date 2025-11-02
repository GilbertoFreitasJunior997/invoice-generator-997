import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createdAt, id, userId } from "@/lib/utils/db.utils";
import { clientSnapshotsTable } from "./client-snapshots.table";
import { userSnapshotsTable } from "./user-snapshots.table";

export const invoicesTable = sqliteTable("invoices", {
	id: id(),

	invoiceNumber: integer("invoice_number", { mode: "number" })
		.notNull()
		.unique(),
	fileName: text("file_name").notNull(),
	invoicedAt: text("invoiced_at").notNull(),

	userId: userId(),
	userSnapshotId: text("user_snapshot_id")
		.notNull()
		.references(() => userSnapshotsTable.id),
	clientSnapshotId: text("client_snapshot_id")
		.notNull()
		.references(() => clientSnapshotsTable.id),

	createdAt: createdAt(),
});
