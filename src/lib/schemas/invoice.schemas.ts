import z from "zod";

export const invoiceGenerationFormSchema = z.object({
	fileName: z.string().min(1),
	clientId: z.string().min(1),
	servicesIds: z.array(z.string()).min(1),
});
export type InvoiceGenerationForm = z.infer<typeof invoiceGenerationFormSchema>;

export const invoiceGenerationSchema = invoiceGenerationFormSchema.extend(
	z.object({
		userId: z.string().min(1),
	}).shape,
);
