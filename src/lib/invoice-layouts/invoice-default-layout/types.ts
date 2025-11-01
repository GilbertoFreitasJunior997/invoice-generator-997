import type { ClientSelect } from "@/lib/schemas/client.schemas";
import type { ServiceSelect } from "@/lib/schemas/service.schemas";
import type { UserSelect } from "@/lib/schemas/user.schemas";

export type InvoiceDefaultLayoutProps = {
	invoiceNumber: number;
	user: UserSelect;
	client: ClientSelect;
	services: ServiceSelect[];
	userLogo?: string;
};
