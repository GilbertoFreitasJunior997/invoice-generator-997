import { usePDF } from "@react-pdf/renderer";
import { getRouteApi } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { InvoiceDefaultLayout } from "@/lib/invoice-layouts/invoice-default-layout";
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

		updatePDF(
			<InvoiceDefaultLayout
				invoiceNumber={nextInvoiceNumber}
				user={user}
				client={selectedClient}
				services={selectedServices}
			/>,
		);
	}, [selectedClient, selectedServices, updatePDF, user, nextInvoiceNumber]);

	return { pdfInstance };
};
