import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { usersTable } from "../db/tables/user.table";
import { ServerBadRequestError } from "../errors/server-fns.errors";
import {
	getAuthUserSchema,
	userSetupAccountSchema,
} from "../schemas/user.schemas";
import {
	createServerErrorResponse,
	createServerSuccessResponse,
} from "../utils/server-fns.utils";

export const getAuthUser = createServerFn({ method: "POST" })
	.inputValidator(getAuthUserSchema)
	.handler(async ({ data }) => {
		try {
			let user = await db.query.usersTable.findFirst({
				where: eq(usersTable.workOsId, data.id),
			});

			if (!user) {
				throw new ServerBadRequestError("User not found");
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

			return createServerSuccessResponse({ data: user });
		} catch (error) {
			return createServerErrorResponse({ error });
		}
	});

export const setupUserAccount = createServerFn({ method: "POST" })
	.inputValidator(userSetupAccountSchema)
	.handler(async ({ data }) => {
		try {
			await db.insert(usersTable).values({
				email: data.email,
				workOsId: data.workOsId,
				name: data.name,
				addressLine1: data.addressLine1,
				addressLine2: data.addressLine2,
				city: data.city,
				state: data.state,
				country: data.country,
				avatarUrl: data.avatarUrl,
			});

			return createServerSuccessResponse();
		} catch (error) {
			return createServerErrorResponse({ error });
		}
	});
