import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { clientsTable } from "../db/tables/clients.table";
import { addressSchema } from "./address.schemas";

export const clientSelectSchema = createSelectSchema(clientsTable);
export type ClientSelect = z.infer<typeof clientSelectSchema>;

export const clientUpsertFormSchema = z
	.object({
		id: z.string().optional(),
		name: z.string().min(1),
		email: z.email().min(1),
	})
	.extend(addressSchema.shape);

export type ClientUpsertForm = z.infer<typeof clientUpsertFormSchema>;

export const clientUpsertSchema = clientUpsertFormSchema.extend(
	clientSelectSchema.pick({ userId: true }).shape,
);
