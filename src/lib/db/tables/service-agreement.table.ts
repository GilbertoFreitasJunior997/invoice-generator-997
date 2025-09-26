import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { commonColumns, userId } from "@/lib/utils/db.utils";
import { clientTable } from "./client.table";
import { userTable } from "./user.table";

export const serviceAgreementTable = sqliteTable("service_agreements", {
	userId: userId(),
	description: text("description").notNull(),
	clientId: integer("client_id")
		.references(() => clientTable.id)
		.notNull(),
	...commonColumns(),
});

export const serviceAgreementRelations = relations(
	serviceAgreementTable,
	({ one }) => ({
		client: one(clientTable, {
			fields: [serviceAgreementTable.clientId],
			references: [clientTable.id],
		}),
		user: one(userTable, {
			fields: [serviceAgreementTable.userId],
			references: [userTable.id],
		}),
	}),
);
