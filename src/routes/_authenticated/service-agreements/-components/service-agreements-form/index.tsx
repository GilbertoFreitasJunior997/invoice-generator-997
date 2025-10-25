import { useEffect } from "react";
import { Button } from "@/lib/components/button";
import { Form } from "@/lib/components/form";
import { Sheet } from "@/lib/components/sheet";
import { Skeleton } from "@/lib/components/skeleton";
import {
	useServerMutation,
	useServerQuery,
} from "@/lib/hooks/use-server-query";
import {
	getServiceAgreementByIdQueryOptions,
	upsertServiceAgreementMutationOptions,
} from "@/lib/query-options/service-agreements.optionts";
import { serviceAgreementUpsertFormSchema } from "@/lib/schemas/service-agreements.schemas";
import { useAppForm } from "@/lib/utils/forms.utils";
import { Route } from "@/routes/_authenticated/service-agreements";

export const ServiceAgreementsForm = () => {
	const { user } = Route.useLoaderData();
	const navigate = Route.useNavigate();
	const { isCreating, editId } = Route.useSearch();

	const isOpen = isCreating || !!editId;
	const isEditing = !!editId;
	const clientId = "123";

	const { mutateAsync: upsertServiceAgreementMutation } = useServerMutation(
		upsertServiceAgreementMutationOptions({
			userId: user.id,
			clientId,
			id: editId ?? undefined,
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

	const { data: serviceAgreement, isFetching: isServiceAgreementLoading } =
		useServerQuery({
			...getServiceAgreementByIdQueryOptions({
				userId: user.id,
				id: editId ?? "",
			}),
			enabled: isEditing,
		});

	const form = useAppForm({
		defaultValues: {
			title: serviceAgreement?.title ?? "",
			description: serviceAgreement?.description ?? "",
			rateAmount: serviceAgreement?.rateAmount ?? "",
			rateCurrency: serviceAgreement?.rateCurrency ?? "",
			status: serviceAgreement?.status ?? "active",
		},
		validators: {
			onChange: serviceAgreementUpsertFormSchema,
		},
		onSubmit: async ({ value }) => {
			await upsertServiceAgreementMutation(value);
		},
	});

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			navigate({
				search: { isCreating: undefined, editId: undefined },
			});
		}
	};

	useEffect(() => {
		if (isEditing && serviceAgreement) {
			form.reset();
		}
	}, [isEditing, serviceAgreement, form]);

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
						{isEditing ? "Edit Service Agreement" : "Add New Service Agreement"}
					</Sheet.Title>

					{isEditing && (
						<Sheet.Description>
							Edit <span className="font-bold">{serviceAgreement?.title}</span>{" "}
							details
						</Sheet.Description>
					)}
				</Sheet.Header>

				<Form.Root form={form}>
					{isServiceAgreementLoading ? (
						<div className="px-4">
							<Skeleton className="h-9 w-full mt-6" />

							<div className="grid grid-cols-3 gap-2 mt-11">
								<Skeleton className="h-9 w-full col-span-2" />
								<Skeleton className="h-9 w-full" />
							</div>
						</div>
					) : (
						<Form.Group className="px-4">
							<form.AppField
								name="title"
								children={(field) => (
									<field.TextInput
										label="Title"
										description="e.g. Web Development"
									/>
								)}
							/>

							<Form.Group className="grid grid-cols-3">
								<form.AppField
									name="description"
									children={(field) => (
										<field.TextInput
											label="Description"
											description="e.g. Software Development"
											fieldRootProps={{
												className: "col-span-3",
											}}
										/>
									)}
								/>

								<form.AppField
									name="rateAmount"
									children={(field) => (
										<field.TextInput
											label="Rate Amount"
											description="e.g. 1000.00"
											fieldRootProps={{
												className: "col-span-2",
											}}
										/>
									)}
								/>

								<form.AppField
									name="rateCurrency"
									children={(field) => (
										<field.TextInput
											label="Currency"
											fieldRootProps={{
												className: "col-span-1",
											}}
											description="e.g. USD"
										/>
									)}
								/>

								<form.AppField
									name="status"
									children={(field) => (
										<field.TextInput
											label="Status"
											description="e.g. Active"
											fieldRootProps={{
												className: "col-span-3",
											}}
										/>
									)}
								/>
							</Form.Group>
						</Form.Group>
					)}

					<Sheet.Footer className="flex flex-row justify-end gap-2">
						<Sheet.Close asChild>
							<Button variant="outline">Cancel</Button>
						</Sheet.Close>

						<form.SubmitButton
							label={`${isEditing ? "Update" : "Add"} Service Agreement`}
							isDisabled={isServiceAgreementLoading}
						/>
					</Sheet.Footer>
				</Form.Root>
			</Sheet.Content>
		</Sheet.Root>
	);
};
