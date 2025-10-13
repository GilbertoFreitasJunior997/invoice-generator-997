import { sql } from "drizzle-orm";
import { integer, text } from "drizzle-orm/sqlite-core";
import { v4 as uuidv4 } from "uuid";

export function createdAt() {
	return integer("created_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`);
}

export function updatedAt() {
	return integer("updated_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`);
}

export function id() {
	return text("id")
		.primaryKey()
		.$defaultFn(() => uuidv4());
}
