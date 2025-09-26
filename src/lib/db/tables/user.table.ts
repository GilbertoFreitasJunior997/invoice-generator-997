import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { commonColumns } from "@/lib/utils/db.utils";

export const userTable = sqliteTable("users", {
	name: text("name"),
	email: text("email"),
	phone: text("phone"),
	addressLine1: text("address_line_1").notNull(),
	addressLine2: text("address_line_2"),
	...commonColumns(),
});
