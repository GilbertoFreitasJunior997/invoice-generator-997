import z from "zod";

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
