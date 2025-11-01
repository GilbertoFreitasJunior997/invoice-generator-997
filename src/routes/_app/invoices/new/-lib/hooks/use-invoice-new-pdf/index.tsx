import { usePDF } from "@react-pdf/renderer";
import { getRouteApi } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { getLogoFromStorage } from "@/lib/components/logo-input/utils";
import { InvoiceDefaultLayout } from "@/lib/invoice-layouts/invoice-default-layout";
import { blobToBase64 } from "@/lib/utils/blobs.utils";
import { useInvoiceNewQueries } from "../use-invoice-new-queries";

const Route = getRouteApi("/_app/invoices/new/");

type UseInvoiceNewPDFProps = {
	clientId?: string;
	servicesIds?: string[];
};
export const useInvoiceNewPDF = ({
	clientId,
	servicesIds,
}: UseInvoiceNewPDFProps) => {
	const { user } = Route.useLoaderData();

	const [isLoading, setIsLoading] = useState(false);
	const [pdfInstance, updatePDF] = usePDF({
		document: undefined,
	});

	const { clientsQuery, servicesQuery, nextInvoiceNumberQuery } =
		useInvoiceNewQueries();
	const { data: clients } = clientsQuery;
	const { data: services } = servicesQuery;
	const { data: nextInvoiceNumber } = nextInvoiceNumberQuery;

	const selectedClient = useMemo(
		() => clients?.find((client) => client.id === clientId) ?? null,
		[clients, clientId],
	);

	const selectedServices = useMemo(
		() =>
			services?.filter((service) => servicesIds?.includes(service.id)) ?? [],
		[services, servicesIds],
	);

	useEffect(() => {
		if (!selectedClient || !selectedServices.length || !nextInvoiceNumber) {
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
						userLogo={userLogo}
						invoiceNumber={nextInvoiceNumber}
						user={user}
						client={selectedClient}
						services={selectedServices}
					/>,
				);
			} finally {
				setIsLoading(false);
			}
		})();
	}, [selectedClient, selectedServices, updatePDF, user, nextInvoiceNumber]);

	return { pdfInstance, isLoading };
};
