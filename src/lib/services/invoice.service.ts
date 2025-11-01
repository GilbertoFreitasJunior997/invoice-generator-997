import { createServerFn } from "@tanstack/react-start";
import { and, eq, inArray } from "drizzle-orm";
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
import { invoiceGenerationSchema } from "../schemas/invoice.schemas";
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

				const [invoice] = await tx
					.insert(invoicesTable)
					.values({
						invoiceNumber: nextInvoiceNumber,
						fileName,
						userId: user.id,
						clientSnapshotId: snapshotClient.id,
						userSnapshotId: snapshotUser.id,
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
						quantity: 1,
						invoiceId: invoice.id,
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

export const getInvoices = createServerFn()
	.inputValidator((d: { userId: string }) => d)
	.handler(async ({ data }) => {
		try {
			const { userId } = data;
			const invoices = await db.query.invoicesTable.findMany({
				where: eq(invoicesTable.userId, userId),
			});

			return createServerSuccessResponse({ data: invoices });
		} catch (error) {
			return createServerErrorResponse({ error });
		}
	});
