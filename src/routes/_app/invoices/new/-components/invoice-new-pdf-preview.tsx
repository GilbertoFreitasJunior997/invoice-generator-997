import { PDFViewer } from "@react-pdf/renderer";
import { useStore } from "@tanstack/react-form";
import { useEffect, useRef } from "react";
import { InvoiceDefaultLayout } from "@/lib/invoice-layouts/invoice-default-layout";
import { withForm } from "@/lib/utils/forms.utils";
import { Route } from "..";
import { useInvoiceNewQueries } from "../-lib/use-invoice-new-queries/useInvoiceNewQueries";
import { invoiceNewFormDefaultValues } from "./consts";

export const InvoiceNewPDFPreview = withForm({
	defaultValues: invoiceNewFormDefaultValues,
	render: function Render({ form }) {
		const { user } = Route.useLoaderData();

		const { clientsQuery, servicesQuery } = useInvoiceNewQueries();
		const { data: clients } = clientsQuery;
		const { data: services } = servicesQuery;

		const clientId = useStore(form.store, (s) => s.values.clientId);
		const servicesIds = useStore(form.store, (s) => s.values.servicesIds);

		const selectedClient =
			clients?.find((client) => client.id === clientId) ?? null;

		const selectedServices =
			services?.filter((service) => servicesIds?.includes(service.id)) ?? [];

		// weird fix to force re-render the PDFViewer when the client or services change
		// yanked from https://stackoverflow.com/questions/79583113/typeerror-eo-is-not-a-function-when-deleting-in-react-pdf
		const count = useRef(0);
		useEffect(() => {
			if (!clientId || !servicesIds?.length) {
				return;
			}

			count.current++;
		}, [clientId, servicesIds?.length]);

		if (!selectedClient || !selectedServices.length) {
			return;
		}

		return (
			<div className="grow flex items-center justify-center">
				<PDFViewer
					showToolbar={false}
					key={count.current}
					className="max-w-3xl w-full h-full rounded-lg"
				>
					<InvoiceDefaultLayout
						user={user}
						client={selectedClient}
						services={selectedServices}
					/>
				</PDFViewer>
			</div>
		);
	},
});
