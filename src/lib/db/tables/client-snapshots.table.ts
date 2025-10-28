import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { snapshotDate } from "@/lib/utils/db.utils";
import { clientsTable, getClientsColumns } from "./clients.table";

export const clientSnapshotsTable = sqliteTable("client_snapshots", {
	...getClientsColumns(),

	clientId: text("client_id").references(() => clientsTable.id, {
		onDelete: "set null",
		onUpdate: "set null",
	}),

	snapshotDate: snapshotDate(),
});
