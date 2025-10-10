import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { usersTable } from "../db/tables/user.table";
import { getAuthUserSchema } from "../schemas/user.schemas";

export const getAuthUser = createServerFn({ method: "POST" })
	.inputValidator(getAuthUserSchema)
	.handler(async ({ data }) => {
		let user = await db.query.usersTable.findFirst({
			where: eq(usersTable.workOsId, data.id),
		});

		if (!user) {
			return null;
		}

		if (user.email !== data.email) {
			[user] = await db
				.update(usersTable)
				.set({
					email: data.email,
				})
				.where(eq(usersTable.workOsId, data.id))
				.returning();
		}

		return user;
	});
