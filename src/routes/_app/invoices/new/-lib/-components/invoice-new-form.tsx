import { withForm } from "@/lib/utils/forms.utils";
import { useInvoiceNewQueries } from "../hooks/use-invoice-new-queries";
import { invoiceNewFormDefaultValues } from "./consts";

export const InvoiceNewForm = withForm({
	defaultValues: invoiceNewFormDefaultValues,
	render: function Render({ form }) {
		const { clientsQuery, servicesQuery, nextInvoiceNumberQuery } =
			useInvoiceNewQueries();
		const { data: clients, isFetching: isClientsLoading } = clientsQuery;
		const { data: services, isFetching: isServicesLoading } = servicesQuery;
		const { data: nextInvoiceNumber, isFetching: isNextInvoiceNumberLoading } =
			nextInvoiceNumberQuery;

		const handleClientChange = (clientId: string) => {
			const client = clients?.find((client) => client.id === clientId);
			if (!client) {
				return;
			}

			form.setFieldValue("fileName", `INV${nextInvoiceNumber}-${client.name}`);
		};

		return (
			<form.Root
				form={form}
				className="w-full"
				isLoading={isNextInvoiceNumberLoading}
			>
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
						name="fileName"
						children={(field) => <field.TextInput label="File Name" />}
					/>
				</form.Group>
			</form.Root>
		);
	},
});
