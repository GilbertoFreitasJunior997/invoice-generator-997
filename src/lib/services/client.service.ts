import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { clientsTable } from "../db/tables";
import { ServerNotFoundError } from "../errors/server-fns.errors";
import { clientUpsertSchema } from "../schemas/client.schemas";
import {
	createServerErrorResponse,
	createServerSuccessResponse,
	HTTP_STATUS,
} from "../utils/server-fns.utils";

export const checkHasClientWithSameCompanyName = createServerFn()
	.inputValidator((d: { userId: string; companyName: string }) => d)
	.handler(async ({ data }) => {
		try {
			const { userId, companyName } = data;

			const client = await db.query.clientsTable.findFirst({
				where: and(
					eq(clientsTable.userId, userId),
					eq(clientsTable.companyName, companyName),
				),
			});
			const hasClientWithSameName = !!client;

			return createServerSuccessResponse({ data: hasClientWithSameName });
		} catch (error) {
			return createServerErrorResponse({ error });
		}
	});

export const getAllClients = createServerFn()
	.inputValidator((d: { userId: string }) => d)
	.handler(async ({ data }) => {
		try {
			const { userId } = data;

			const clients = await db.query.clientsTable.findMany({
				where: eq(clientsTable.userId, userId),
			});

			return createServerSuccessResponse({ data: clients });
		} catch (error) {
			return createServerErrorResponse({ error });
		}
	});

export const getClientById = createServerFn()
	.inputValidator((d: { userId: string; id: string }) => d)
	.handler(async ({ data }) => {
		try {
			const { userId, id } = data;

			const client = await db.query.clientsTable.findFirst({
				where: and(eq(clientsTable.userId, userId), eq(clientsTable.id, id)),
			});

			if (!client) {
				throw new ServerNotFoundError("Client not found");
			}

			return createServerSuccessResponse({ data: client });
		} catch (error) {
			return createServerErrorResponse({ error });
		}
	});

export const upsertClient = createServerFn()
	.inputValidator(clientUpsertSchema)
	.handler(async ({ data }) => {
		try {
			if (data.id) {
				const [client] = await db
					.update(clientsTable)
					.set({
						addressLine1: data.addressLine1,
						addressLine2: data.addressLine2,
						companyName: data.companyName,
						updatedAt: new Date(),
					})
					.where(eq(clientsTable.id, data.id))
					.returning();

				return createServerSuccessResponse({
					data: client,
					message: `${data.companyName} updated successfully`,
				});
			}

			const [client] = await db
				.insert(clientsTable)
				.values({
					userId: data.userId,
					addressLine1: data.addressLine1,
					addressLine2: data.addressLine2,
					companyName: data.companyName,
				})
				.returning();

			return createServerSuccessResponse({
				data: client,
				message: `${data.companyName} created successfully`,
				status: HTTP_STATUS.CREATED,
			});
		} catch (error) {
			return createServerErrorResponse({ error });
		}
	});

export const removeClient = createServerFn()
	.inputValidator((d: { userId: string; id: string }) => d)
	.handler(async ({ data }) => {
		try {
			const { userId, id } = data;

			const [client] = await db
				.delete(clientsTable)
				.where(and(eq(clientsTable.userId, userId), eq(clientsTable.id, id)))
				.returning();

			return createServerSuccessResponse({
				data: client,
				message: `${client.companyName} deleted successfully`,
			});
		} catch (error) {
			return createServerErrorResponse({ error });
		}
	});
