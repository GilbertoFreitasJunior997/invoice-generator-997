import type { InvoiceGenerationForm } from "@/lib/schemas/invoice.schemas";

export const invoiceNewFormDefaultValues = {
	fileName: "",
	clientId: "",
	servicesIds: [] as string[],
	invoicedAt: new Date(),
	invoiceNumber: 0,
} satisfies InvoiceGenerationForm;
