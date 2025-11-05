import { text } from "drizzle-orm/sqlite-core";
import { v4 as uuidv4 } from "uuid";
import { usersTable } from "../db/tables/user.table";
import { formatDbDate } from "./date.utils";

export function createdAt() {
	return text("created_at")
		.notNull()
		.$defaultFn(() => formatDbDate());
}

export function updatedAt() {
	return text("updated_at")
		.notNull()
		.$defaultFn(() => formatDbDate());
}

export function snapshotDate() {
	return text("snapshot_date")
		.notNull()
		.$defaultFn(() => formatDbDate());
}

export function id() {
	return text("id")
		.primaryKey()
		.$defaultFn(() => uuidv4());
}

export function userId() {
	return text("user_id")
		.notNull()
		.references(() => usersTable.id, {
			onDelete: "cascade",
			onUpdate: "cascade",
		});
}
