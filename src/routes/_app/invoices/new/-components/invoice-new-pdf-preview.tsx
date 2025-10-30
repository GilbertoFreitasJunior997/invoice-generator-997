import { usePDF } from "@react-pdf/renderer";
import { useStore } from "@tanstack/react-form";
import { DownloadIcon } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Button } from "@/lib/components/button";
import { InvoiceDefaultLayout } from "@/lib/invoice-layouts/invoice-default-layout";
import { cn } from "@/lib/utils/cn";
import { withForm } from "@/lib/utils/forms.utils";
import { useInvoiceNewQueries } from "../-lib/use-invoice-new-queries/useInvoiceNewQueries";
import { Route } from "../index";
import { invoiceNewFormDefaultValues } from "./consts";

export const InvoiceNewPDFPreview = withForm({
	defaultValues: invoiceNewFormDefaultValues,
	render: function Render({ form }) {
		const { user } = Route.useLoaderData();

		const { clientsQuery, servicesQuery } = useInvoiceNewQueries();
		const { data: clients, isFetching: isClientsLoading } = clientsQuery;
		const { data: services, isFetching: isServicesLoading } = servicesQuery;

		const clientId = useStore(form.store, (s) => s.values.clientId);
		const servicesIds = useStore(form.store, (s) => s.values.servicesIds);

		const selectedClient = useMemo(
			() => clients?.find((client) => client.id === clientId) ?? null,
			[clientId, clients],
		);
		const selectedServices = useMemo(
			() =>
				services?.filter((service) => servicesIds.includes(service.id)) ?? [],
			[servicesIds, services],
		);

		const [pdfInstance, updatePdf] = usePDF({
			document: undefined,
		});
		useEffect(() => {
			if (!selectedClient || !selectedServices.length) {
				return;
			}

			updatePdf(
				<InvoiceDefaultLayout
					user={user}
					client={selectedClient}
					services={selectedServices}
				/>,
			);
		}, [updatePdf, user, selectedClient, selectedServices]);

		if (
			!pdfInstance.url ||
			!selectedClient ||
			!selectedServices.length ||
			isClientsLoading ||
			isServicesLoading
		) {
			return <div />;
		}

		return (
			<div className="flex-1 flex items-center justify-center">
				<div className="flex flex-col flex-1 h-full gap-1 max-w-3xl">
					<iframe
						src={pdfInstance.url}
						className="flex-1 h-full rounded-lg w-full"
						title="Invoice"
					/>
					<form.Subscribe
						selector={(state) => ({
							isSubmitting: state.isSubmitting,
							canSubmit: state.canSubmit,
						})}
					>
						{({ isSubmitting, canSubmit }) => {
							const isDisabled = isSubmitting || !canSubmit;

							return (
								<Button
									className="w-full"
									asChild
									onClick={() => {
										form.handleSubmit();
									}}
									disabled={isDisabled}
								>
									<a
										href={pdfInstance.url ?? ""}
										download="invoice.pdf"
										className={cn(
											isDisabled && "opacity-50 pointer-events-none",
										)}
										aria-disabled={isDisabled}
									>
										<DownloadIcon className="size-4" />
										{isSubmitting ? "Saving generated invoice..." : "Download"}
									</a>
								</Button>
							);
						}}
					</form.Subscribe>
				</div>
			</div>
		);
	},
});
