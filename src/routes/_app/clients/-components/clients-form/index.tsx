import { useStore } from "@tanstack/react-form";
import { useEffect } from "react";
import { AddressForm } from "@/lib/components/address-form";
import { Button } from "@/lib/components/button";
import { Sheet } from "@/lib/components/sheet";
import { Skeleton } from "@/lib/components/skeleton";
import {
	useServerMutation,
	useServerQuery,
} from "@/lib/hooks/use-server-query";
import {
	checkHasClientWithSameNameQueryOptions,
	getClientByIdQueryOptions,
	upsertClientMutationOptions,
} from "@/lib/query-options/client.query-options";
import { clientUpsertFormSchema } from "@/lib/schemas/client.schemas";
import { defaultCountry } from "@/lib/utils/address.utils";
import { useAppForm } from "@/lib/utils/forms.utils";
import { Route } from "@/routes/_app/clients";

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
			name: client?.name ?? "",
			email: client?.email ?? "",
			addressLine1: client?.addressLine1 ?? "",
			addressLine2: client?.addressLine2 ?? "",
			country: client?.country ?? defaultCountry,
			state: client?.state ?? "",
			city: client?.city ?? "",
			zip: client?.zip ?? "",
			taxId: client?.taxId ?? "",
		},
		validators: {
			onChange: clientUpsertFormSchema,
		},
		onSubmit: async ({ value }) => {
			await upsertClientMutation(value);
		},
	});

	const name = useStore(form.store, (s) => s.values.name);
	const {
		data: hasClientWithSameName,
		isFetching: isLoadingHasClientWithSameName,
	} = useServerQuery({
		...checkHasClientWithSameNameQueryOptions({
			userId: user.id,
			name: name,
		}),
		enabled: !!name,
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
					name: hasClientWithSameName
						? "You already have a client with this name"
						: undefined,
					...form.getAllErrors().form.errorMap.onChange,
				},
			},
		});
	}, [hasClientWithSameName, form]);

	return (
		<Sheet.Root open={isOpen} onOpenChange={handleOpenChange} modal={true}>
			<Sheet.Content className="w-md">
				<Sheet.Header>
					<Sheet.Title>
						{isEditing ? "Edit Client" : "Add New Client"}
					</Sheet.Title>

					{isEditing && (
						<Sheet.Description>
							Edit <span className="font-bold">{client?.name}</span> details
						</Sheet.Description>
					)}
				</Sheet.Header>

				<form.Root form={form}>
					{isClientLoading ? (
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
									<field.TextInput label="Name" placeholder="Acme Inc." />
								)}
							/>

							<form.AppField
								name="email"
								children={(field) => (
									<field.TextInput
										label="Email"
										placeholder="accounting@acmeinc.com"
									/>
								)}
							/>

							<AddressForm form={form} layout="stacked" />
						</form.Group>
					)}

					<Sheet.Footer className="flex flex-row justify-end gap-2">
						<Sheet.Close asChild>
							<Button variant="outline">Cancel</Button>
						</Sheet.Close>

						<form.SubmitButton
							disabled={isClientLoading || isLoadingHasClientWithSameName}
						>
							{isEditing ? "Update" : "Add"} Client
						</form.SubmitButton>
					</Sheet.Footer>
				</form.Root>
			</Sheet.Content>
		</Sheet.Root>
	);
};
