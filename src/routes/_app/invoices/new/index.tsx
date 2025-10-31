import { usePDF } from "@react-pdf/renderer";
import { createFileRoute } from "@tanstack/react-router";
import { InvoiceDefaultLayout } from "@/lib/invoice-layouts/invoice-default-layout";
import { invoiceGenerationFormSchema } from "@/lib/schemas/invoice.schemas";
import { useAppForm } from "@/lib/utils/forms.utils";
import { invoiceNewFormDefaultValues } from "./-components/consts";
import { InvoiceNewForm } from "./-components/invoice-new-form";
import { InvoiceNewPDFPreview } from "./-components/invoice-new-pdf-preview";
import { useInvoiceNewQueries } from "./-lib/use-invoice-new-queries/useInvoiceNewQueries";

export const Route = createFileRoute("/_app/invoices/new/")({
	ssr: "data-only",
	loader: ({ context }) => ({
		user: context.user,
	}),
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = Route.useNavigate();
	const { user } = Route.useLoaderData();
	const { clientsQuery, servicesQuery } = useInvoiceNewQueries();
	const { data: clients } = clientsQuery;
	const { data: services } = servicesQuery;

	const form = useAppForm({
		defaultValues: invoiceNewFormDefaultValues,
		validators: {
			onChange: invoiceGenerationFormSchema,
		},
		onSubmit: async () => {
			await new Promise((resolve) => setTimeout(resolve, 5000));
			form.reset();

			navigate({
				to: "/invoices",
			});
		},
	});

	const [pdfInstance, updatePdf] = usePDF({
		document: undefined,
	});

	const handleInputChange = ({
		clientId: propClientId,
		servicesIds: propServicesIds,
	}: Partial<typeof invoiceNewFormDefaultValues>) => {
		const clientId = propClientId ?? form.store.state.values.clientId;
		const servicesIds = propServicesIds ?? form.store.state.values.servicesIds;

		const selectedClient =
			clients?.find((client) => client.id === clientId) ?? null;

		const selectedServices =
			services?.filter((service) => servicesIds?.includes(service.id)) ?? [];

		if (!selectedClient || !selectedServices.length) {
			return;
		}

		console.log(user, selectedClient, selectedServices);

		updatePdf(
			<InvoiceDefaultLayout
				user={user}
				client={selectedClient}
				services={selectedServices}
			/>,
		);
	};

	return (
		<div className="w-full h-full">
			<h1>Create Invoice</h1>

			<div className="flex gap-2 h-full w-full">
				<InvoiceNewForm form={form} onChange={handleInputChange} />

				<InvoiceNewPDFPreview pdfInstance={pdfInstance} />
			</div>
		</div>
	);
}
