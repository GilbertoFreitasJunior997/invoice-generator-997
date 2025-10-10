import { sql } from "drizzle-orm";
import { integer } from "drizzle-orm/sqlite-core";

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
