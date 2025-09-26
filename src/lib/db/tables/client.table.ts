import { relations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { commonColumns, userId } from "@/lib/utils/db.utils";
import { userTable } from "./user.table";

export const clientTable = sqliteTable("clients", {
	name: text("name").notNull(),
	userId: userId(),
	addressLine1: text("address_line_1").notNull(),
	addressLine2: text("address_line_2"),
	...commonColumns(),
});

export const clientRelations = relations(clientTable, ({ one }) => ({
	user: one(userTable, {
		fields: [clientTable.userId],
		references: [userTable.id],
	}),
}));
