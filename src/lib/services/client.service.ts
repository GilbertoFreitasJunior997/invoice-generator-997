import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { clientsTable } from "../db/tables";
import { clientUpsertSchema } from "../schemas/client.schemas";
import type { UserSelect } from "../schemas/user.schemas";

export const getAllClients = createServerFn()
	.inputValidator((d) => d as { user: UserSelect })
	.handler(async ({ data }) => {
		const { user } = data;

		const clients = await db.query.clientsTable.findMany({
			where: eq(clientsTable.userId, user.id),
		});

		return clients;
	});

export const getClientById = createServerFn()
	.inputValidator((d) => d as { user: UserSelect; id: string })
	.handler(async ({ data }) => {
		const { user, id } = data;

		const client = await db.query.clientsTable.findFirst({
			where: and(eq(clientsTable.userId, user.id), eq(clientsTable.id, id)),
		});

		return client;
	});

export const upsertClient = createServerFn()
	.inputValidator(clientUpsertSchema)
	.handler(async ({ data }) => {
		const [client] = await db
			.insert(clientsTable)
			.values({
				id: data.id,
				addressLine1: data.addressLine1,
				addressLine2: data.addressLine2,
				companyName: data.companyName,
				userId: data.userId,
			})
			.onConflictDoUpdate({
				target: clientsTable.id,
				set: {
					addressLine1: data.addressLine1,
					addressLine2: data.addressLine2,
					companyName: data.companyName,
				},
			})
			.returning();

		return client;
	});

export const removeClient = createServerFn()
	.inputValidator((d) => d as { user: UserSelect; id: string })
	.handler(async ({ data }) => {
		const { user, id } = data;

		const [client] = await db
			.delete(clientsTable)
			.where(and(eq(clientsTable.userId, user.id), eq(clientsTable.id, id)))
			.returning();

		return client;
	});
