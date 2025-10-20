import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { clientsTable } from "../db/tables/clients.table";

export const clientSelectSchema = createSelectSchema(clientsTable);
export type ClientSelect = z.infer<typeof clientSelectSchema>;

export const clientUpsertFormSchema = z.object({
	id: z.string().optional(),
	companyName: z.string().min(1),
	addressLine1: z.string().min(1),
	addressLine2: z.string(),
});
export type ClientUpsertForm = z.infer<typeof clientUpsertFormSchema>;

export const clientUpsertSchema = clientUpsertFormSchema.extend(
	clientSelectSchema.pick({ userId: true }).shape,
);
