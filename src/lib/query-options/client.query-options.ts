import { mutationOptions, queryOptions } from "@tanstack/react-query";
import type { ClientUpsertForm } from "../schemas/client.schemas";
import type { UserSelect } from "../schemas/user.schemas";
import {
	checkHasClientWithSameCompanyName,
	getAllClients,
	getClientById,
	removeClient,
	upsertClient,
} from "../services/client.service";

export const getAllClientsQueryOptions = (data: { user: UserSelect }) =>
	queryOptions({
		queryKey: ["clients", data.user.id],
		queryFn: () =>
			getAllClients({
				data,
			}),
	});

export const getClientByIdQueryOptions = (data: {
	user: UserSelect;
	id: string;
}) =>
	queryOptions({
		queryKey: ["clients", data.user.id, data.id],
		queryFn: () =>
			getClientById({
				data,
			}),
	});

export const upsertClientMutationOptions = (data: {
	user: UserSelect;
	editId?: string;
	onSuccess?: () => void;
}) =>
	mutationOptions({
		mutationFn: (formData: ClientUpsertForm) => {
			return upsertClient({
				data: {
					...formData,
					userId: data.user.id,
					id: data.editId ?? undefined,
				},
			});
		},
		onSuccess: (_a, _b, _c, context) => {
			context.client.invalidateQueries({
				queryKey: ["clients"],
				exact: false,
			});

			data.onSuccess?.();
		},
	});

export const checkHasClientWithSameCompanyNameQueryOptions = (data: {
	user: UserSelect;
	companyName: string;
}) =>
	queryOptions({
		queryKey: [
			"clients",
			data.user.id,
			"check-has-client-with-same-company-name",
			data.companyName,
		],
		queryFn: () =>
			checkHasClientWithSameCompanyName({
				data: {
					userId: data.user.id,
					companyName: data.companyName,
				},
			}),
	});

export const removeClientMutationOptions = (data: {
	id: string;
	user: UserSelect;
	onSuccess?: () => void;
}) =>
	mutationOptions({
		mutationFn: () =>
			removeClient({
				data: { user: data.user, id: data.id },
			}),
		onSuccess: (_a, _b, _c, context) => {
			context.client.invalidateQueries({
				queryKey: ["clients"],
				exact: false,
			});

			data.onSuccess?.();
		},
	});
