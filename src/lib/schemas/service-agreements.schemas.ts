import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import {
	serviceAgreementStatusEnum,
	serviceAgreementsTable,
} from "../db/tables/service-agreements.table";

export const serviceAgreementSelectSchema = createSelectSchema(
	serviceAgreementsTable,
);
export type ServiceAgreementSelect = z.infer<
	typeof serviceAgreementSelectSchema
>;

export const serviceAgreementUpsertFormSchema = z.object({
	id: z.string().optional(),
	title: z.string().min(1),
	description: z.string(),
	rateAmount: z.string().min(1),
	rateCurrency: z.string().min(1),
	status: z.enum(serviceAgreementStatusEnum),
});
export type ServiceAgreementUpsertForm = z.infer<
	typeof serviceAgreementUpsertFormSchema
>;

export const serviceAgreementUpsertSchema =
	serviceAgreementUpsertFormSchema.extend(
		serviceAgreementSelectSchema.pick({ userId: true, clientId: true }).shape,
	);
