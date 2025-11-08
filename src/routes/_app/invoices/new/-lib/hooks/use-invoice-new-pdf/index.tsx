import { usePDF } from "@react-pdf/renderer";
import { getRouteApi } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { getLogoFromStorage } from "@/lib/components/logo-input/utils";
import { InvoiceDefaultLayout } from "@/lib/invoice-layouts/invoice-default-layout";
import type {
	InvoiceGenerationForm,
	InvoiceGenerationServiceWithQuantity,
} from "@/lib/schemas/invoice.schemas";
import { blobToBase64 } from "@/lib/utils/blobs.utils";
import { useInvoiceNewQueries } from "../use-invoice-new-queries";

const Route = getRouteApi("/_app/invoices/new/");

type UseInvoiceNewPDFProps = Pick<
	InvoiceGenerationForm,
	"invoiceNumber" | "clientId" | "services" | "invoicedAt" | "dueDate"
>;
export const useInvoiceNewPDF = ({
	invoiceNumber,
	clientId,
	services,
	invoicedAt,
	dueDate,
}: UseInvoiceNewPDFProps) => {
	const { user } = Route.useRouteContext();

	const [isLoading, setIsLoading] = useState(false);
	const [pdfInstance, updatePDF] = usePDF({
		document: undefined,
	});

	const { clientsQuery, servicesQuery } = useInvoiceNewQueries();
	const { data: clients } = clientsQuery;
	const { data: allServices } = servicesQuery;

	const selectedClient = useMemo(
		() => clients?.find((client) => client.id === clientId) ?? null,
		[clients, clientId],
	);

	const selectedServices = useMemo(() => {
		const selectedServices: InvoiceGenerationServiceWithQuantity[] = [];

		for (const service of services) {
			if (!service?.serviceId) {
				continue;
			}

			const allService = allServices?.find((s) => s.id === service.serviceId);

			if (!allService) {
				throw new Error(`Service "${service.serviceId}" not found`);
			}

			selectedServices.push({
				...allService,
				quantity: service.quantity,
			});
		}

		return selectedServices;
	}, [services, allServices]);

	useEffect(() => {
		if (
			!selectedClient ||
			!selectedServices.length ||
			!invoiceNumber ||
			!invoicedAt
		) {
			return;
		}

		(async () => {
			try {
				setIsLoading(true);
				let userLogo: string | undefined;

				if (user.logoKey) {
					const file = await getLogoFromStorage(user.logoKey);
					const base64 = await blobToBase64(file);
					userLogo = base64;
				}

				updatePDF(
					<InvoiceDefaultLayout
						invoicedAt={invoicedAt}
						dueDate={dueDate}
						userLogo={userLogo}
						invoiceNumber={invoiceNumber}
						user={user}
						client={selectedClient}
						services={selectedServices}
					/>,
				);
			} finally {
				setIsLoading(false);
			}
		})();
	}, [
		selectedClient,
		selectedServices,
		updatePDF,
		user,
		invoiceNumber,
		invoicedAt,
		dueDate,
	]);

	return { pdfInstance, isLoading };
};
