import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { clientsTable } from "../db/tables/clients.table";

export const clientSelectSchema = createSelectSchema(clientsTable);
export type ClientSelect = z.infer<typeof clientSelectSchema>;

export const clientUpsertFormSchema = z.object({
	id: z.string().optional(),
	name: z.string().min(1),
	email: z.email().min(1),
	addressLine1: z.string().min(1),
	addressLine2: z.string(),
	country: z.string().min(1),
	state: z.string().min(1),
	city: z.string().min(1),
	zip: z.string().min(1),
	taxId: z.string(),
});
export type ClientUpsertForm = z.infer<typeof clientUpsertFormSchema>;

export const clientUpsertSchema = clientUpsertFormSchema.extend(
	clientSelectSchema.pick({ userId: true }).shape,
);
