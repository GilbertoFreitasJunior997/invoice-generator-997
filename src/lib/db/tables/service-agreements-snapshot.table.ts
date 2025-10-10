import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import {
	getServiceAgreementsColumns,
	serviceAgreementsTable,
} from "./service-agreements.table";

export const serviceAgreementsSnapshotsTable = sqliteTable(
	"service_agreements_snapshots",
	{
		...getServiceAgreementsColumns(),

		serviceAgreementId: text("service_agreement_id")
			.notNull()
			.references(() => serviceAgreementsTable.id),
		snapshotDate: integer("snapshot_date", { mode: "timestamp" })
			.notNull()
			.default(sql`(unixepoch())`),
	},
);
