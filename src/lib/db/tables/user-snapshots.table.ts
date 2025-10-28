import { sqliteTable } from "drizzle-orm/sqlite-core";
import { snapshotDate, userId } from "@/lib/utils/db.utils";
import { getUsersColumns } from "./user.table";

export const userSnapshotsTable = sqliteTable("user_snapshots", {
	...getUsersColumns(),

	userId: userId(),
	snapshotDate: snapshotDate(),
});
