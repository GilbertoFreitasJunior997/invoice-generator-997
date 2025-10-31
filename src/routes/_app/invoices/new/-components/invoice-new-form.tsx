import { withForm } from "@/lib/utils/forms.utils";
import { useInvoiceNewQueries } from "../-lib/use-invoice-new-queries/useInvoiceNewQueries";
import { invoiceNewFormDefaultValues } from "./consts";

type InvoiceNewFormProps = {
	onChange: (params: Partial<typeof invoiceNewFormDefaultValues>) => void;
};

export const InvoiceNewForm = withForm({
	defaultValues: invoiceNewFormDefaultValues,
	props: {} as InvoiceNewFormProps,
	render: function Render({ form, onChange }) {
		const { clientsQuery, servicesQuery } = useInvoiceNewQueries();
		const { data: clients, isFetching: isClientsLoading } = clientsQuery;
		const { data: services, isFetching: isServicesLoading } = servicesQuery;

		return (
			<form.Root form={form} className="w-[30%] max-w-[400px]">
				<form.Group className="">
					<form.AppField
						name="clientId"
						listeners={{
							onChange: ({ value }) => onChange({ clientId: value }),
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
						listeners={{
							onChange: ({ value }) => onChange({ servicesIds: value }),
						}}
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
