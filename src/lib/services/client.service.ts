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

export const checkHasClientWithSameName = createServerFn()
	.inputValidator((d: { userId: string; name: string }) => d)
	.handler(async ({ data }) => {
		try {
			const { userId, name } = data;

			const client = await db.query.clientsTable.findFirst({
				where: and(
					eq(clientsTable.userId, userId),
					eq(clientsTable.name, name),
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
						name: data.name,
						city: data.city,
						state: data.state,
						country: data.country,
						zip: data.zip,
						email: data.email,
						taxId: data.taxId,
						updatedAt: new Date(),
					})
					.where(eq(clientsTable.id, data.id))
					.returning();

				return createServerSuccessResponse({
					data: client,
					message: `${data.name} updated successfully`,
				});
			}

			const [client] = await db
				.insert(clientsTable)
				.values({
					userId: data.userId,
					addressLine1: data.addressLine1,
					addressLine2: data.addressLine2,
					name: data.name,
					city: data.city,
					state: data.state,
					country: data.country,
					zip: data.zip,
					email: data.email,
					taxId: data.taxId,
				})
				.returning();

			return createServerSuccessResponse({
				data: client,
				message: `${data.name} created successfully`,
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

			const client = await db.transaction(async (tx) => {
				const [client] = await tx
					.delete(clientsTable)
					.where(and(eq(clientsTable.userId, userId), eq(clientsTable.id, id)))
					.returning();

				return client;
			});

			return createServerSuccessResponse({
				data: client,
				message: `${client.name} deleted successfully`,
			});
		} catch (error) {
			return createServerErrorResponse({ error });
		}
	});
