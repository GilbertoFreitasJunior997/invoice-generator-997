import { useEffect } from "react";
import { Button } from "@/lib/components/button";
import { Dialog } from "@/lib/components/dialog";
import { Form } from "@/lib/components/form";
import { useServerQuery } from "@/lib/hooks/use-server-query";
import { getAllClientsQueryOptions } from "@/lib/query-options/client.query-options";
import { getAllServicesQueryOptions } from "@/lib/query-options/service.query-options";
import { invoiceGenerationFormSchema } from "@/lib/schemas/invoice.schemas";
import { useAppForm } from "@/lib/utils/forms.utils";
import { Route } from "../index";

export const InvoiceGenerationForm = () => {
	const { user } = Route.useLoaderData();
	const { isCreating } = Route.useSearch();
	const isOpen = !!isCreating;

	const navigate = Route.useNavigate();

	const { data: clients, isFetching: isClientsLoading } = useServerQuery({
		...getAllClientsQueryOptions({
			userId: user.id,
		}),
		enabled: isOpen,
	});

	const { data: services, isFetching: isServicesLoading } = useServerQuery({
		...getAllServicesQueryOptions({
			userId: user.id,
		}),
		enabled: isOpen,
	});

	const form = useAppForm({
		defaultValues: {
			clientId: "",
			servicesIds: [] as string[],
		},
		validators: {
			onChange: invoiceGenerationFormSchema,
		},
		onSubmit: async ({ value }) => {
			console.log(value);
		},
	});

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			navigate({
				search: { isCreating: undefined },
			});
		}
	};

	useEffect(() => {
		if (!isOpen) {
			form.reset();
		}
	}, [isOpen, form]);

	return (
		<Dialog.Root open={isOpen} onOpenChange={handleOpenChange} modal={true}>
			<Dialog.Content className="w-[90dvw] h-[90dvh]">
				<Dialog.Header>
					<Dialog.Title>Create Invoice</Dialog.Title>
				</Dialog.Header>

				<Form.Root form={form}>
					<Form.Group className="grid grid-cols-3 gap-2 mb-2">
						<form.AppField
							name="clientId"
							children={(field) => (
								<field.SelectInput
									label="Client"
									items={clients?.map((client) => ({
										label: client.companyName,
										value: client.id,
									}))}
									isLoading={isClientsLoading}
								/>
							)}
						/>

						<form.AppField
							name="servicesIds"
							children={(field) => (
								<field.ComboboxInput
									label="Services"
									items={services?.map((service) => ({
										label: service.name,
										value: service.id,
									}))}
									isLoading={isServicesLoading}
								/>
							)}
						/>
					</Form.Group>

					<Button className="col-span-1">Create Invoice</Button>
				</Form.Root>
			</Dialog.Content>
		</Dialog.Root>
	);
};
