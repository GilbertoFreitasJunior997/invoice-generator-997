import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { snapshotDate } from "@/lib/utils/db.utils";
import { getUsersColumns, usersTable } from "./user.table";

export const userSnapshotsTable = sqliteTable("user_snapshots", {
	...getUsersColumns(),

	userId: text("user_id")
		.notNull()
		.references(() => usersTable.id),
	snapshotDate: snapshotDate(),
});
