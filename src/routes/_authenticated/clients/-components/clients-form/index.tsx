import { useStore } from "@tanstack/react-form";
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
	checkHasClientWithSameCompanyNameQueryOptions,
	getClientByIdQueryOptions,
	upsertClientMutationOptions,
} from "@/lib/query-options/client.query-options";
import { clientUpsertFormSchema } from "@/lib/schemas/client.schemas";
import { useAppForm } from "@/lib/utils/forms.utils";
import { Route } from "@/routes/_authenticated/clients";

export const ClientsForm = () => {
	const { user } = Route.useLoaderData();
	const navigate = Route.useNavigate();
	const { isCreating, editId } = Route.useSearch();

	const isOpen = isCreating || !!editId;
	const isEditing = !!editId;

	const { mutateAsync: upsertClientMutation } = useServerMutation(
		upsertClientMutationOptions({
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

	const { data: client, isFetching: isClientLoading } = useServerQuery({
		...getClientByIdQueryOptions({
			userId: user.id,
			id: editId ?? "",
		}),
		enabled: isEditing,
	});

	const form = useAppForm({
		defaultValues: {
			companyName: client?.companyName ?? "",
			addressLine1: client?.addressLine1 ?? "",
			addressLine2: client?.addressLine2 ?? "",
		},
		validators: {
			onChange: clientUpsertFormSchema,
		},
		onSubmit: async ({ value }) => {
			await upsertClientMutation(value);
		},
	});

	const companyName = useStore(form.store, (s) => s.values.companyName);
	const {
		data: hasClientWithSameName,
		isFetching: isLoadingHasClientWithSameName,
	} = useServerQuery({
		...checkHasClientWithSameCompanyNameQueryOptions({
			userId: user.id,
			companyName,
		}),
		enabled: !!companyName,
	});

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			navigate({
				search: { isCreating: undefined, editId: undefined },
			});
		}
	};

	useEffect(() => {
		if (isEditing && client) {
			form.reset();
		}
	}, [isEditing, client, form]);

	useEffect(() => {
		if (!isOpen) {
			form.reset();
		}
	}, [isOpen, form]);

	useEffect(() => {
		const errorMap = form.getAllErrors().form.errorMap;

		form.setErrorMap({
			...errorMap,
			onChange: {
				fields: {
					companyName: hasClientWithSameName
						? "Company name already exists"
						: undefined,
					...form.getAllErrors().form.errorMap.onChange,
				},
			},
		});
	}, [hasClientWithSameName, form]);

	return (
		<Sheet.Root open={isOpen} onOpenChange={handleOpenChange} modal={true}>
			<Sheet.Content>
				<Sheet.Header>
					<Sheet.Title>
						{isEditing ? "Edit Client" : "Add New Client"}
					</Sheet.Title>

					{isEditing && (
						<Sheet.Description>
							Edit <span className="font-bold">{client?.companyName}</span>{" "}
							details
						</Sheet.Description>
					)}
				</Sheet.Header>

				<Form.Root form={form}>
					{isClientLoading ? (
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
								name="companyName"
								children={(field) => (
									<field.TextInput
										label="Company Name"
										inputProps={{ placeholder: "Acme Inc." }}
									/>
								)}
							/>

							<Form.Group className="grid grid-cols-3">
								<form.AppField
									name="addressLine1"
									children={(field) => (
										<field.TextInput
											label="Address line 1"
											inputProps={{
												placeholder: "123 Main Street",
											}}
											fieldRootProps={{
												className: "col-span-2",
											}}
										/>
									)}
								/>

								<form.AppField
									name="addressLine2"
									children={(field) => (
										<field.TextInput
											label="Address line 2"
											inputProps={{
												placeholder: "Apt 123",
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
							label={`${isEditing ? "Update" : "Add"} Client`}
							isDisabled={isClientLoading || isLoadingHasClientWithSameName}
						/>
					</Sheet.Footer>
				</Form.Root>
			</Sheet.Content>
		</Sheet.Root>
	);
};
