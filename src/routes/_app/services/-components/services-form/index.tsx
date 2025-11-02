import { useStore } from "@tanstack/react-form";
import { getRouteApi } from "@tanstack/react-router";
import { Button } from "@/lib/components/button";
import { Sheet } from "@/lib/components/sheet";
import {
	useServerMutation,
	useServerQuery,
} from "@/lib/hooks/use-server-query";
import {
	getServiceByIdQueryOptions,
	upsertServiceMutationOptions,
} from "@/lib/query-options/service.query-options";
import {
	currenciesSelectOptions,
	getCurrencyConfig,
} from "@/lib/schemas/currency.schemas";
import { serviceUpsertFormSchema } from "@/lib/schemas/service.schemas";
import { useAppForm } from "@/lib/utils/forms.utils";

const Route = getRouteApi("/_app/services/");

export const ServicesForm = () => {
	const navigate = Route.useNavigate();
	const { isCreating, editId } = Route.useSearch();

	const isOpen = isCreating || !!editId;
	const isEditing = !!editId;

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			navigate({
				search: { isCreating: undefined, editId: undefined },
			});
		}
	};

	return (
		<Sheet.Root open={isOpen} onOpenChange={handleOpenChange}>
			<Sheet.Content className="w-md">
				<Sheet.Header>
					<Sheet.Title>
						{isEditing ? `Edit Service Details` : "Add New Service"}
					</Sheet.Title>
				</Sheet.Header>

				<ServiceFormContent editId={editId} isEditing={isEditing} />
			</Sheet.Content>
		</Sheet.Root>
	);
};

type ServiceFormContentProps = {
	editId?: string;
	isEditing: boolean;
};
const ServiceFormContent = ({ editId, isEditing }: ServiceFormContentProps) => {
	const { user } = Route.useLoaderData();
	const navigate = Route.useNavigate();

	const { mutateAsync: upsertServiceMutation } = useServerMutation(
		upsertServiceMutationOptions({
			userId: user.id,
			editId,
			onSuccess: () => {
				navigate({
					search: {
						isCreating: undefined,
						editId: undefined,
					},
				});
			},
		}),
	);

	const { data: service, isFetching: isServiceLoading } = useServerQuery({
		...getServiceByIdQueryOptions({
			userId: user.id,
			id: editId ?? "",
		}),
		enabled: isEditing,
	});

	const form = useAppForm({
		defaultValues: {
			name: service?.name ?? "",
			description: service?.description ?? "",
			rate: service?.rate ?? 0,
			currency: service?.currency ?? "USD",
		},
		validators: {
			onChange: serviceUpsertFormSchema,
		},
		onSubmit: ({ value }) => upsertServiceMutation(value),
	});

	const selectedCurrency = useStore(form.store, (s) => s.values.currency);
	const { prefix, thousandSeparator, decimalSeparator } =
		getCurrencyConfig(selectedCurrency);

	return (
		<form.Root form={form} isLoading={isServiceLoading}>
			<Sheet.Body>
				<form.Group className="px-4">
					<form.AppField
						name="name"
						children={(field) => (
							<field.TextInput
								label="Name"
								placeholder="Website Design, Acme Inc. Contract, etc."
								description="This will not be displayed on the invoice. Used for organizational purposes."
							/>
						)}
					/>

					<form.Group className="grid grid-cols-3">
						<form.AppField
							name="description"
							children={(field) => (
								<field.TextArea
									label="Description"
									description="Describe the service you are offering. This will be displayed to your clients."
									placeholder="Software Development, Design, etc."
									rootClassName="col-span-3"
								/>
							)}
						/>

						<form.AppField
							name="rate"
							children={(field) => (
								<field.NumberInput
									label="Rate"
									thousandSeparator={thousandSeparator}
									decimalSeparator={decimalSeparator}
									decimalScale={2}
									fixedDecimalScale={true}
									prefix={prefix}
									min={0}
									allowNegative={false}
									rootClassName="col-span-2"
								/>
							)}
						/>

						<form.AppField
							name="currency"
							children={(field) => (
								<field.SelectInput
									label="Currency"
									items={currenciesSelectOptions}
									rootClassName="col-span-1"
								/>
							)}
						/>
					</form.Group>
				</form.Group>
			</Sheet.Body>

			<Sheet.Footer className="flex flex-row justify-end gap-2">
				<Sheet.Close asChild>
					<Button variant="outline">Cancel</Button>
				</Sheet.Close>

				<form.SubmitButton disabled={isServiceLoading}>
					{isEditing ? "Update" : "Add"} Service
				</form.SubmitButton>
			</Sheet.Footer>
		</form.Root>
	);
};
