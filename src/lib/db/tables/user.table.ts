import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users", {
	id: text("id").primaryKey(),
	email: text("email").notNull(),
});
