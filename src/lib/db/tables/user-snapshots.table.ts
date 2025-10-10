import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { getUsersColumns, usersTable } from "./user.table";

export const userSnapshotsTable = sqliteTable("user_snapshots", {
	...getUsersColumns(),

	userId: text("user_id")
		.notNull()
		.references(() => usersTable.id),
	snapshotDate: integer("snapshot_date", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
});
