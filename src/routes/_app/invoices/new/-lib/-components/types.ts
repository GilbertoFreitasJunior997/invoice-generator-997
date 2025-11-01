import type { UsePDFInstance } from "@react-pdf/renderer";

export type InvoiceNewPDFPreviewProps = {
	pdfInstance?: UsePDFInstance;
	clientId?: string;
	servicesIds?: string[];
};
