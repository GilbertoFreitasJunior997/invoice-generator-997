import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { serviceAgreementsTable } from "../db/tables/service-agreements.table";
import { ServerNotFoundError } from "../errors/server-fns.errors";
import { serviceAgreementUpsertSchema } from "../schemas/service-agreements.schemas";
import {
	createServerErrorResponse,
	createServerSuccessResponse,
	HTTP_STATUS,
} from "../utils/server-fns.utils";

export const getAllServiceAgreements = createServerFn()
	.inputValidator((d: { userId: string }) => d)
	.handler(async ({ data }) => {
		try {
			const { userId } = data;

			const serviceAgreements = await db.query.serviceAgreementsTable.findMany({
				where: eq(serviceAgreementsTable.userId, userId),
			});

			return createServerSuccessResponse({ data: serviceAgreements });
		} catch (error) {
			return createServerErrorResponse({ error });
		}
	});

export const getServiceAgreementById = createServerFn()
	.inputValidator((d: { userId: string; id: string }) => d)
	.handler(async ({ data }) => {
		try {
			const { userId, id } = data;

			const serviceAgreement = await db.query.serviceAgreementsTable.findFirst({
				where: and(
					eq(serviceAgreementsTable.userId, userId),
					eq(serviceAgreementsTable.id, id),
				),
			});

			if (!serviceAgreement) {
				throw new ServerNotFoundError("Service agreement not found");
			}

			return createServerSuccessResponse({ data: serviceAgreement });
		} catch (error) {
			return createServerErrorResponse({ error });
		}
	});

export const upsertServiceAgreement = createServerFn()
	.inputValidator(serviceAgreementUpsertSchema)
	.handler(async ({ data }) => {
		try {
			if (data.id) {
				const [serviceAgreement] = await db
					.update(serviceAgreementsTable)
					.set({
						title: data.title,
						description: data.description,
						rateAmount: data.rateAmount,
						rateCurrency: data.rateCurrency,
						status: data.status,
					})
					.where(eq(serviceAgreementsTable.id, data.id))
					.returning();

				return createServerSuccessResponse({
					data: serviceAgreement,
					message: `${data.title} updated successfully`,
				});
			}

			const [serviceAgreement] = await db
				.insert(serviceAgreementsTable)
				.values({
					userId: data.userId,
					clientId: data.clientId,
					title: data.title,
					description: data.description,
					rateAmount: data.rateAmount,
					rateCurrency: data.rateCurrency,
					status: data.status,
				})
				.returning();

			return createServerSuccessResponse({
				data: serviceAgreement,
				message: `${data.title} created successfully`,
				status: HTTP_STATUS.CREATED,
			});
		} catch (error) {
			return createServerErrorResponse({ error });
		}
	});

export const removeServiceAgreement = createServerFn()
	.inputValidator((d: { userId: string; id: string }) => d)
	.handler(async ({ data }) => {
		try {
			const { userId, id } = data;

			const [serviceAgreement] = await db
				.delete(serviceAgreementsTable)
				.where(
					and(
						eq(serviceAgreementsTable.userId, userId),
						eq(serviceAgreementsTable.id, id),
					),
				)
				.returning();

			return createServerSuccessResponse({
				data: serviceAgreement,
				message: `${serviceAgreement.title} deleted successfully`,
			});
		} catch (error) {
			return createServerErrorResponse({ error });
		}
	});
