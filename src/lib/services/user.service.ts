import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { usersTable } from "../db/tables/user.table";
import { ServerBadRequestError } from "../errors/server-fns.errors";
import {
	getAuthUserSchema,
	userSetupAccountSchema,
} from "../schemas/user.schemas";
import { formatDbDate } from "../utils/date.utils";
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
						updatedAt: formatDbDate(),
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
				zip: data.zip,
				taxId: data.taxId,
				logoKey: data.logoKey,
			});

			return createServerSuccessResponse();
		} catch (error) {
			return createServerErrorResponse({ error });
		}
	});

export const getUserNextInvoiceNumber = createServerFn({ method: "GET" })
	.inputValidator((d: { userId: string }) => d)
	.handler(async ({ data }) => {
		try {
			const user = await db.query.usersTable.findFirst({
				where: eq(usersTable.id, data.userId),
			});

			if (!user) {
				throw new ServerBadRequestError("User not found");
			}

			const nextInvoiceNumber = user.currentInvoiceNumber + 1;

			return createServerSuccessResponse({ data: nextInvoiceNumber });
		} catch (error) {
			return createServerErrorResponse({ error });
		}
	});

export const updateUserCurrentInvoiceNumber = createServerFn({ method: "POST" })
	.inputValidator((d: { userId: string; currentInvoiceNumber: number }) => d)
	.handler(async ({ data }) => {
		try {
			const user = await db.query.usersTable.findFirst({
				where: eq(usersTable.id, data.userId),
			});

			if (!user) {
				throw new ServerBadRequestError("User not found");
			}

			await db
				.update(usersTable)
				.set({
					currentInvoiceNumber: data.currentInvoiceNumber,
					updatedAt: formatDbDate(),
				})
				.where(eq(usersTable.id, data.userId));

			return createServerSuccessResponse({
				message: "Invoice number updated successfully",
			});
		} catch (error) {
			return createServerErrorResponse({ error });
		}
	});
