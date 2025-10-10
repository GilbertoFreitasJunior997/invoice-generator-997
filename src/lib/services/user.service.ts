import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { usersTable } from "../db/tables/user.table";
import { getAuthUserSchema } from "../schemas/user.schemas";

export const getAuthUser = createServerFn({ method: "POST" })
	.inputValidator(getAuthUserSchema)
	.handler(async ({ data }) => {
		let user = await db.query.usersTable.findFirst({
			where: eq(usersTable.id, data.id),
		});

		if (!user) {
			const result = await db
				.insert(usersTable)
				.values({
					id: data.id,
					email: data.email,
				})
				.returning();

			user = result[0];
		} else if (user?.email !== data.email) {
			const result = await db
				.update(usersTable)
				.set({
					email: data.email,
				})
				.where(eq(usersTable.id, data.id))
				.returning();

			user = result[0];
		}

		return user;
	});
