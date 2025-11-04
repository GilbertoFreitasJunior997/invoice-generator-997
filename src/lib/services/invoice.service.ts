import { createServerFn } from "@tanstack/react-start";
import { and, count, eq, inArray } from "drizzle-orm";
import { cloneLogoToStorage } from "../components/logo-input/utils";
import { db } from "../db";
import {
	clientSnapshotsTable,
	clientsTable,
	invoiceItemsTable,
	invoicesTable,
	servicesTable,
	userSnapshotsTable,
	usersTable,
} from "../db/tables";
import { ServerBadRequestError } from "../errors/server-fns.errors";
import type { PaginationServiceParams } from "../schemas/global.schemas";
import { invoiceGenerationSchema } from "../schemas/invoice.schemas";
import { formatDbDate } from "../utils/date.utils";
import {
	createServerErrorResponse,
	createServerSuccessResponse,
} from "../utils/server-fns.utils";

export const createInvoice = createServerFn()
	.inputValidator(invoiceGenerationSchema)
	.handler(async ({ data }) => {
		try {
			const { userId, clientId, servicesIds, fileName } = data;

			const invoice = await db.transaction(async (tx) => {
				const user = await tx.query.usersTable.findFirst({
					where: eq(usersTable.id, userId),
				});

				if (!user) {
					throw new ServerBadRequestError("User not found");
				}

				const client = await tx.query.clientsTable.findFirst({
					where: and(
						eq(clientsTable.userId, user.id),
						eq(clientsTable.id, clientId),
					),
				});

				if (!client) {
					throw new ServerBadRequestError("Client not found");
				}

				const services = await tx.query.servicesTable.findMany({
					where: and(
						eq(servicesTable.userId, user.id),
						inArray(servicesTable.id, servicesIds),
					),
				});

				if (!services.length || services.length !== servicesIds.length) {
					throw new ServerBadRequestError("Services not found");
				}

				const [snapshotClient] = await tx
					.insert(clientSnapshotsTable)
					.values({
						...client,
						id: undefined,
						clientId: client.id,
					})
					.returning();

				let snapshotUserLogoKey: string | undefined;
				if (user.logoKey) {
					snapshotUserLogoKey = await cloneLogoToStorage(user.logoKey);
				}

				const [snapshotUser] = await tx
					.insert(userSnapshotsTable)
					.values({
						id: undefined,
						name: user.name,
						avatarUrl: user.avatarUrl,
						email: user.email,
						currentInvoiceNumber: user.currentInvoiceNumber,
						taxId: user.taxId,
						addressLine1: user.addressLine1,
						addressLine2: user.addressLine2,
						city: user.city,
						state: user.state,
						country: user.country,
						zip: user.zip,
						userId: user.id,
						logoKey: snapshotUserLogoKey,
					})
					.returning();

				const nextInvoiceNumber = user.currentInvoiceNumber + 1;
				const totalAmount = services.reduce(
					// TODO: use quantity
					(sum, service) => sum + service.rate * 1,
					0,
				);

				const [invoice] = await tx
					.insert(invoicesTable)
					.values({
						invoiceNumber: nextInvoiceNumber,
						fileName,
						userId: user.id,
						clientSnapshotId: snapshotClient.id,
						userSnapshotId: snapshotUser.id,
						invoicedAt: formatDbDate({
							date: data.invoicedAt,
							withTime: false,
						}),
						totalAmount,
					})
					.returning();

				await tx
					.update(usersTable)
					.set({
						currentInvoiceNumber: nextInvoiceNumber,
					})
					.where(eq(usersTable.id, userId));

				await tx.insert(invoiceItemsTable).values(
					services.map((service) => ({
						...service,
						id: undefined,
						// TODO: use quantity
						quantity: 1,
						invoiceId: invoice.id,
						serviceId: service.id,
					})),
				);

				return invoice;
			});

			return createServerSuccessResponse({
				data: invoice,
				message: "Invoice created successfully",
			});
		} catch (error) {
			return createServerErrorResponse({ error });
		}
	});

export const getInvoicesPaginatedWithRelations = createServerFn()
	.inputValidator((d: PaginationServiceParams) => d)
	.handler(async ({ data }) => {
		try {
			const { userId, page, pageSize } = data;

			const invoicesQuery = db.query.invoicesTable.findMany({
				where: eq(invoicesTable.userId, userId),
				offset: (page - 1) * pageSize,
				limit: pageSize,
				with: {
					clientSnapshot: true,
					userSnapshot: true,
					items: true,
				},
			});

			const countQuery = db
				.select({ count: count() })
				.from(invoicesTable)
				.where(eq(invoicesTable.userId, userId));

			const [invoices, [{ count: total }]] = await db.batch([
				invoicesQuery,
				countQuery,
			]);

			return createServerSuccessResponse({ data: { invoices, total } });
		} catch (error) {
			return createServerErrorResponse({ error });
		}
	});

export const checkIsUserFirstInvoice = createServerFn()
	.inputValidator((d: { userId: string }) => d)
	.handler(async ({ data }) => {
		try {
			const { userId } = data;
			const invoice = await db.query.invoicesTable.findFirst({
				where: eq(invoicesTable.userId, userId),
			});

			const isFirstInvoice = !invoice;

			return createServerSuccessResponse({ data: isFirstInvoice });
		} catch (error) {
			return createServerErrorResponse({ error });
		}
	});
