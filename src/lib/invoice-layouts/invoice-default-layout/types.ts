import type { ClientSelect } from "@/lib/schemas/client.schemas";
import type { InvoiceGenerationServiceWithQuantity } from "@/lib/schemas/invoice.schemas";
import type { UserSelect } from "@/lib/schemas/user.schemas";

export type InvoiceDefaultLayoutProps = {
	invoiceNumber: number;
	user: UserSelect;
	client: ClientSelect;
	services: InvoiceGenerationServiceWithQuantity[];
	invoicedAt: Date;
	userLogo?: string;
};
