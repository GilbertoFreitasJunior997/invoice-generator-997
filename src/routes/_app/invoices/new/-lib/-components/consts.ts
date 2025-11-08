import type { InvoiceGenerationForm } from "@/lib/schemas/invoice.schemas";

export const invoiceNewFormDefaultValues = {
	fileName: "",
	clientId: "",
	services: [
		{
			serviceId: "",
			quantity: 1,
		},
	],
	invoicedAt: new Date(),
	invoiceNumber: 0,
} as InvoiceGenerationForm satisfies InvoiceGenerationForm;
