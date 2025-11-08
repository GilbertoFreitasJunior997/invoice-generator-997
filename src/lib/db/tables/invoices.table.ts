import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import {
	type InvoiceStatus,
	invoiceStatuses,
} from "@/lib/schemas/invoice-status.schemas";
import { createdAt, id, userId } from "@/lib/utils/db.utils";
import { clientSnapshotsTable } from "./client-snapshots.table";
import { userSnapshotsTable } from "./user-snapshots.table";

export const invoicesTable = sqliteTable("invoices", {
	id: id(),

	invoiceNumber: integer("invoice_number", { mode: "number" }).notNull(),
	fileName: text("file_name").notNull(),
	invoicedAt: text("invoiced_at").notNull(),
	dueDate: text("due_date"),
	totalAmount: real("total_amount").notNull(),
	status: text("status", {
		enum: invoiceStatuses as [InvoiceStatus, ...InvoiceStatus[]],
	})
		.default("pending")
		.notNull(),

	userId: userId(),
	userSnapshotId: text("user_snapshot_id")
		.notNull()
		.references(() => userSnapshotsTable.id),
	clientSnapshotId: text("client_snapshot_id")
		.notNull()
		.references(() => clientSnapshotsTable.id),

	createdAt: createdAt(),
});
