import type { InferSelectModel } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";
import z from "zod";
import {
	type clientSnapshotsTable,
	type invoiceItemsTable,
	invoicesTable,
	type userSnapshotsTable,
} from "../db/tables";

export const invoiceSelectSchema = createSelectSchema(invoicesTable);
export type InvoiceSelect = z.infer<typeof invoiceSelectSchema>;

export type InvoiceSelectWithRelations = InvoiceSelect & {
	clientSnapshot: InferSelectModel<typeof clientSnapshotsTable>;
	userSnapshot: InferSelectModel<typeof userSnapshotsTable>;
	items: InferSelectModel<typeof invoiceItemsTable>[];
};

export const invoiceGenerationFormSchema = z.object({
	fileName: z.string().min(1),
	clientId: z.string().min(1),
	servicesIds: z.array(z.string()).min(1),
	invoicedAt: z.date(),
});
export type InvoiceGenerationForm = z.infer<typeof invoiceGenerationFormSchema>;

export const invoiceGenerationSchema = invoiceGenerationFormSchema.extend(
	z.object({
		userId: z.string().min(1),
	}).shape,
);

export const invoiceNewFirstInvoiceFormSchema = z.object({
	currentInvoiceNumber: z.number(),
	isFirstInvoice: z.boolean(),
});
export type InvoiceNewFirstInvoiceForm = z.infer<
	typeof invoiceNewFirstInvoiceFormSchema
>;

export const invoiceNewFirstInvoiceSchema =
	invoiceNewFirstInvoiceFormSchema.extend(
		z.object({
			userId: z.string().min(1),
		}).shape,
	);
