import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { clientsTable, getClientsColumns } from "./clients.table";

export const clientSnapshotsTable = sqliteTable("client_snapshots", {
	...getClientsColumns(),
	clientId: text("client_id")
		.notNull()
		.references(() => clientsTable.id),
	snapshotDate: integer("snapshot_date", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
});
