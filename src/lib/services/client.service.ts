import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { clientsTable } from "../db/tables";
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
