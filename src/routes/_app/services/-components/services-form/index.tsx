import { useStore } from "@tanstack/react-form";
import { useEffect } from "react";
import { Button } from "@/lib/components/button";
import { Sheet } from "@/lib/components/sheet";
import { Skeleton } from "@/lib/components/skeleton";
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
	currencyDecimalSeparators,
	currencyPrefixes,
	currencyThousandSeparators,
} from "@/lib/schemas/currency.schemas";
import { serviceUpsertFormSchema } from "@/lib/schemas/service.schemas";
import { useAppForm } from "@/lib/utils/forms.utils";
import { Route } from "@/routes/_app/services";

export const ServicesForm = () => {
	const { user } = Route.useLoaderData();
	const navigate = Route.useNavigate();
	const { isCreating, editId } = Route.useSearch();

	const isOpen = isCreating || !!editId;
	const isEditing = !!editId;

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
	const currencyPrefix =
		currencyPrefixes[selectedCurrency] ?? currencyPrefixes.USD;

	const currencyDecimalSeparator =
		currencyDecimalSeparators[selectedCurrency] ??
		currencyDecimalSeparators.USD;

	const currencyThousandSeparator =
		currencyThousandSeparators[selectedCurrency] ??
		currencyThousandSeparators.USD;

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			navigate({
				search: { isCreating: undefined, editId: undefined },
			});
		}
	};

	useEffect(() => {
		if (isEditing && service) {
			form.reset();
		}
	}, [isEditing, service, form]);

	useEffect(() => {
		if (!isOpen) {
			form.reset();
		}
	}, [isOpen, form]);

	return (
		<Sheet.Root open={isOpen} onOpenChange={handleOpenChange} modal={true}>
			<Sheet.Content>
				<Sheet.Header>
					<Sheet.Title>
						{isEditing ? "Edit Service" : "Add New Service"}
					</Sheet.Title>

					{isEditing && (
						<Sheet.Description>
							Edit <span className="font-bold">{service?.name}</span> details
						</Sheet.Description>
					)}
				</Sheet.Header>

				<form.Root form={form}>
					{isServiceLoading ? (
						<div className="px-4">
							<Skeleton className="h-9 w-full mt-6" />

							<div className="grid grid-cols-3 gap-2 mt-11">
								<Skeleton className="h-9 w-full col-span-2" />
								<Skeleton className="h-9 w-full" />
							</div>
						</div>
					) : (
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
											thousandSeparator={currencyThousandSeparator}
											decimalSeparator={currencyDecimalSeparator}
											decimalScale={2}
											fixedDecimalScale={true}
											prefix={currencyPrefix}
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
					)}

					<Sheet.Footer className="flex flex-row justify-end gap-2">
						<Sheet.Close asChild>
							<Button variant="outline">Cancel</Button>
						</Sheet.Close>

						<form.SubmitButton disabled={isServiceLoading}>
							${isEditing ? "Update" : "Add"} Service
						</form.SubmitButton>
					</Sheet.Footer>
				</form.Root>
			</Sheet.Content>
		</Sheet.Root>
	);
};
