import { relations } from "drizzle-orm";
import { clientSnapshotsTable } from "./client-snapshots.table";
import { clientsTable } from "./clients.table";
import { invoicesTable } from "./invoices.table";
import { usersTable } from "./user.table";
import { userSnapshotsTable } from "./user-snapshots.table";

export const usersRelations = relations(usersTable, ({ many }) => ({
	snapshots: many(userSnapshotsTable),
	invoices: many(invoicesTable),
	clients: many(clientsTable),
}));

export const clientsRelations = relations(clientsTable, ({ many, one }) => ({
	snapshots: many(clientSnapshotsTable),
	invoices: many(invoicesTable),
	user: one(usersTable, {
		fields: [clientsTable.userId],
		references: [usersTable.id],
	}),
}));

export const userSnapshotsRelations = relations(
	userSnapshotsTable,
	({ one, many }) => ({
		user: one(usersTable, {
			fields: [userSnapshotsTable.userId],
			references: [usersTable.id],
		}),
		invoices: many(invoicesTable),
	}),
);

export const clientSnapshotsRelations = relations(
	clientSnapshotsTable,
	({ one, many }) => ({
		client: one(clientsTable, {
			fields: [clientSnapshotsTable.clientId],
			references: [clientsTable.id],
		}),
		invoices: many(invoicesTable),
	}),
);

export const invoicesRelations = relations(invoicesTable, ({ one }) => ({
	user: one(usersTable, {
		fields: [invoicesTable.userId],
		references: [usersTable.id],
	}),
	client: one(clientsTable, {
		fields: [invoicesTable.clientId],
		references: [clientsTable.id],
	}),
	userSnapshot: one(userSnapshotsTable, {
		fields: [invoicesTable.userSnapshotId],
		references: [userSnapshotsTable.id],
	}),
	clientSnapshot: one(clientSnapshotsTable, {
		fields: [invoicesTable.clientSnapshotId],
		references: [clientSnapshotsTable.id],
	}),
}));
