import type {
	InvoiceGenerationForm,
	InvoiceGenerationService,
} from "@/lib/schemas/invoice.schemas";

export const invoiceNewFormDefaultValues = {
	fileName: "",
	clientId: "",
	services: [] as InvoiceGenerationService[],
	invoicedAt: new Date(),
	invoiceNumber: 0,
} satisfies InvoiceGenerationForm;
