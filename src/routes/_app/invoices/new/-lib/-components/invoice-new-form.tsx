import { withForm } from "@/lib/utils/forms.utils";
import { useInvoiceNewQueries } from "../hooks/use-invoice-new-queries";
import { invoiceNewFormDefaultValues } from "./consts";

const normalizeCompanyName = (name: string) => {
	return name
		.replace(/[^\w\s-]/g, "")
		.replace(/\s+/g, "-")
		.toLowerCase();
};

export const InvoiceNewForm = withForm({
	defaultValues: invoiceNewFormDefaultValues,
	render: function Render({ form }) {
		const { clientsQuery, servicesQuery } = useInvoiceNewQueries();

		const { data: clients, isFetching: isClientsLoading } = clientsQuery;
		const { data: services, isFetching: isServicesLoading } = servicesQuery;

		const createInvoiceFileName = (
			invoiceNumber: number,
			clientName: string,
		) => {
			return `INV${invoiceNumber}-${normalizeCompanyName(clientName)}`;
		};

		const handleInvoiceNumberChange = (invoiceNumber: number) => {
			if (!invoiceNumber) {
				return;
			}

			const selectedClientId = form.getFieldValue("clientId");
			const selectedClient = clients?.find(
				(client) => client.id === selectedClientId,
			);
			if (!selectedClient) {
				return;
			}

			form.setFieldValue(
				"fileName",
				createInvoiceFileName(invoiceNumber, selectedClient.name),
			);
		};

		const handleClientChange = (clientId: string) => {
			const currentInvoiceNumber = form.getFieldValue("invoiceNumber");
			if (!currentInvoiceNumber) {
				return;
			}

			const client = clients?.find((client) => client.id === clientId);
			if (!client) {
				return;
			}

			form.setFieldValue(
				"fileName",
				createInvoiceFileName(currentInvoiceNumber, client.name),
			);
		};

		return (
			<form.Root form={form} className="w-full">
				<form.Group className="">
					<form.AppField
						name="clientId"
						listeners={{
							onChange: ({ value }) => handleClientChange(value),
						}}
						children={(field) => (
							<field.SelectInput
								label="Client"
								items={clients?.map((client) => ({
									label: client.name,
									value: client.id,
								}))}
								isLoading={isClientsLoading}
							/>
						)}
					/>
					<form.AppField
						name="servicesIds"
						children={(field) => (
							<field.SelectMultipleInput
								label="Services"
								items={services?.map((service) => ({
									label: service.name,
									value: service.id,
								}))}
								isLoading={isServicesLoading}
							/>
						)}
					/>

					<form.AppField
						name="invoicedAt"
						children={(field) => <field.DateInput label="Invoice Date" />}
					/>

					<form.AppField
						name="fileName"
						children={(field) => (
							<field.TextInput
								label="File Name"
								description="Recommended to use the invoice number and client name (e.g. 'INV1-Acme-Inc')."
							/>
						)}
					/>

					<form.AppField
						name="invoiceNumber"
						listeners={{
							onChange: ({ value }) => handleInvoiceNumberChange(value),
						}}
						children={(field) => (
							<field.NumberInput
								label="Invoice Number"
								description="The number of the invoice to be created. Automatically generated from last invoice number."
								min={1}
								allowNegative={false}
							/>
						)}
					/>
				</form.Group>
			</form.Root>
		);
	},
});
