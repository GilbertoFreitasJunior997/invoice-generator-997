import type { UsePDFInstance } from "@react-pdf/renderer";
import type { InvoiceGenerationService } from "@/lib/schemas/invoice.schemas";

export type InvoiceNewPDFPreviewProps = {
	pdfInstance?: UsePDFInstance;
	clientId?: string;
	services?: InvoiceGenerationService[];
};
