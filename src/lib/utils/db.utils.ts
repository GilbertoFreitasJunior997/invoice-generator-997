import { sql } from "drizzle-orm";
import { integer } from "drizzle-orm/sqlite-core";
import { userTable } from "../db/tables/user.table";

// created as functions so can be hoisted
export function id() {
	return integer("id").primaryKey({ autoIncrement: true }).notNull();
}
export function createdAt() {
	return integer("created_at").default(sql`CURRENT_TIMESTAMP`).notNull();
}
export function updatedAt() {
	return integer("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull();
}

export function commonColumns() {
	return {
		id: id(),
		createdAt: createdAt(),
		updatedAt: updatedAt(),
	};
}

export function userId() {
	return integer("user_id")
		.references(() => userTable.id, {
			onUpdate: "cascade",
			onDelete: "cascade",
		})
		.notNull();
}
