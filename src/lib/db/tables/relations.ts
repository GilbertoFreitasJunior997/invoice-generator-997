import { relations } from "drizzle-orm";
import { clientSnapshotsTable } from "./client-snapshots.table";
import { clientsTable } from "./clients.table";
import { invoiceItemsTable } from "./invoice-item.table";
import { invoicesTable } from "./invoices.table";
import { servicesTable } from "./services.table";
import { usersTable } from "./user.table";
import { userSnapshotsTable } from "./user-snapshots.table";

export const usersRelations = relations(usersTable, ({ many }) => ({
	invoices: many(invoicesTable),
	clients: many(clientsTable),
	services: many(servicesTable),
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

export const clientsRelations = relations(clientsTable, ({ one, many }) => ({
	user: one(usersTable, {
		fields: [clientsTable.userId],
		references: [usersTable.id],
	}),
	snapshots: many(clientSnapshotsTable),
}));

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

export const servicesRelations = relations(servicesTable, ({ one, many }) => ({
	user: one(usersTable, {
		fields: [servicesTable.userId],
		references: [usersTable.id],
	}),
	items: many(invoiceItemsTable),
}));

export const invoiceItemsRelations = relations(
	invoiceItemsTable,
	({ one }) => ({
		invoice: one(invoicesTable, {
			fields: [invoiceItemsTable.invoiceId],
			references: [invoicesTable.id],
		}),
		service: one(servicesTable, {
			fields: [invoiceItemsTable.serviceId],
			references: [servicesTable.id],
		}),
	}),
);

export const invoicesRelations = relations(invoicesTable, ({ one, many }) => ({
	user: one(usersTable, {
		fields: [invoicesTable.userId],
		references: [usersTable.id],
	}),
	userSnapshot: one(userSnapshotsTable, {
		fields: [invoicesTable.userSnapshotId],
		references: [userSnapshotsTable.id],
	}),
	clientSnapshot: one(clientSnapshotsTable, {
		fields: [invoicesTable.clientSnapshotId],
		references: [clientSnapshotsTable.id],
	}),
	items: many(invoiceItemsTable),
}));
