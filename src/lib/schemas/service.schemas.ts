import { createSelectSchema } from "drizzle-zod";
import z from "zod";
import { servicesTable } from "../db/tables/services.table";
import { currencyEnumSchema } from "./currency.schemas";
import { serviceStatusEnumSchema } from "./service-status.schemas";

const serviceSelectSchema = createSelectSchema(servicesTable);

export type ServiceSelect = z.infer<typeof serviceSelectSchema>;

export const serviceUpsertFormSchema = z.object({
	id: z.string().optional(),
	name: z.string().min(1),
	description: z.string().min(1),
	rate: z.number().min(0),
	currency: currencyEnumSchema,
	status: serviceStatusEnumSchema,
});
export type ServiceUpsertForm = z.infer<typeof serviceUpsertFormSchema>;

export const serviceUpsertSchema = serviceUpsertFormSchema.extend(
	serviceSelectSchema.pick({ userId: true }).shape,
);
