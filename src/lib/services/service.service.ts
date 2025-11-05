import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { servicesTable } from "../db/tables";
import { ServerNotFoundError } from "../errors/server-fns.errors";
import { serviceUpsertSchema } from "../schemas/service.schemas";
import { formatDbDate } from "../utils/date.utils";
import {
	createServerErrorResponse,
	createServerSuccessResponse,
} from "../utils/server-fns.utils";
import { HTTP_STATUS } from "../utils/server-fns-types.utils";

export const getAllServices = createServerFn()
	.inputValidator((d: { userId: string }) => d)
	.handler(async ({ data }) => {
		try {
			const { userId } = data;

			const services = await db.query.servicesTable.findMany({
				where: eq(servicesTable.userId, userId),
			});

			return createServerSuccessResponse({ data: services });
		} catch (error) {
			return createServerErrorResponse({ error });
		}
	});

export const getAllActiveServices = createServerFn()
	.inputValidator((d: { userId: string }) => d)
	.handler(async ({ data }) => {
		try {
			const { userId } = data;

			const services = await db.query.servicesTable.findMany({
				where: and(
					eq(servicesTable.userId, userId),
					eq(servicesTable.status, "active"),
				),
			});

			return createServerSuccessResponse({ data: services });
		} catch (error) {
			createServerErrorResponse({ error });
		}
	});

export const getServiceById = createServerFn()
	.inputValidator((d: { userId: string; id: string }) => d)
	.handler(async ({ data }) => {
		try {
			const { userId, id } = data;

			const service = await db.query.servicesTable.findFirst({
				where: and(eq(servicesTable.userId, userId), eq(servicesTable.id, id)),
			});

			if (!service) {
				throw new ServerNotFoundError("Service not found");
			}

			return createServerSuccessResponse({ data: service });
		} catch (error) {
			return createServerErrorResponse({ error });
		}
	});

export const upsertService = createServerFn()
	.inputValidator(serviceUpsertSchema)
	.handler(async ({ data }) => {
		try {
			const { id } = data;

			if (id) {
				const [service] = await db
					.update(servicesTable)
					.set({
						name: data.name,
						description: data.description,
						rate: data.rate,
						currency: data.currency,
						status: data.status,
						updatedAt: formatDbDate(),
					})
					.where(eq(servicesTable.id, id))
					.returning();

				return createServerSuccessResponse({
					data: service,
					message: `Service updated successfully`,
				});
			}

			const [service] = await db
				.insert(servicesTable)
				.values({
					userId: data.userId,
					name: data.name,
					description: data.description,
					rate: data.rate,
					currency: data.currency,
					status: data.status,
				})
				.returning();

			return createServerSuccessResponse({
				data: service,
				message: `Service created successfully`,
				status: HTTP_STATUS.CREATED,
			});
		} catch (error) {
			return createServerErrorResponse({ error });
		}
	});

export const deleteService = createServerFn()
	.inputValidator((d: { userId: string; id: string }) => d)
	.handler(async ({ data }) => {
		const { userId, id } = data;

		const [service] = await db
			.delete(servicesTable)
			.where(and(eq(servicesTable.userId, userId), eq(servicesTable.id, id)))
			.returning();

		return createServerSuccessResponse({
			data: service,
			message: `Service deleted successfully`,
		});
	});
