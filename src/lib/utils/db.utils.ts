import { type SQL, sql } from "drizzle-orm";
import { type SQLiteTable, text } from "drizzle-orm/sqlite-core";
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

export const getUpdateBatchColumnsSql = <T extends { id?: string }>({
	table,
	columns,
	values,
}: {
	table: SQLiteTable & {
		id: {
			dataType: "string";
		};
	};
	columns: (keyof T)[];
	values: T[];
}) => {
	const updateBatchColumnsSql = {} as Record<keyof T, SQL>;
	const ids: string[] = [];

	for (const column of columns) {
		const sqlChunks = [sql`(CASE`];

		for (const value of values) {
			if (!value.id) {
				throw new Error(
					"Item ID is required for item update. Item: " +
						JSON.stringify(value, null, 2),
				);
			}

			sqlChunks.push(sql`WHEN ${table.id} = ${value.id} then ${value[column]}`);

			ids.push(value.id);
		}

		sqlChunks.push(sql`END)`);

		updateBatchColumnsSql[column] = sql.join(sqlChunks, sql.raw(" "));
	}

	return { updateBatchColumnsSql, ids };
};
