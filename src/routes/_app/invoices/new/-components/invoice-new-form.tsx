import { withForm } from "@/lib/utils/forms.utils";
import { useInvoiceNewQueries } from "../-lib/use-invoice-new-queries/useInvoiceNewQueries";
import { invoiceNewFormDefaultValues } from "./consts";

export const InvoiceNewForm = withForm({
	defaultValues: invoiceNewFormDefaultValues,
	render: function Render({ form }) {
		const { clientsQuery, servicesQuery } = useInvoiceNewQueries();
		const { data: clients, isFetching: isClientsLoading } = clientsQuery;
		const { data: services, isFetching: isServicesLoading } = servicesQuery;

		return (
			<form.Root form={form} className="w-[30%] max-w-[400px]">
				<form.Group className="">
					<form.AppField
						name="clientId"
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
				</form.Group>
			</form.Root>
		);
	},
});
