import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { snapshotDate } from "@/lib/utils/db.utils";
import { getServicesColumns, servicesTable } from "./services.table";

export const servicesSnapshotsTable = sqliteTable("services_snapshots", {
	...getServicesColumns(),

	serviceId: text("service_id")
		.notNull()
		.references(() => servicesTable.id),

	snapshotDate: snapshotDate(),
});
