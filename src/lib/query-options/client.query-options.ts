import { mutationOptions, queryOptions } from "@tanstack/react-query";
import type { ClientUpsertForm } from "../schemas/client.schemas";
import {
	checkHasClientWithSameName,
	getAllClients,
	getClientById,
	removeClient,
	upsertClient,
} from "../services/client.service";

const baseKeys = ["clients"] as const;
export const clientQueryKeys = {
	base: baseKeys,
	all: (userId: string) => [...baseKeys, userId],
	byId: (userId: string, id: string) => [...baseKeys, userId, id],
	checkHasClientWithSameName: (userId: string, name: string) => [
		...baseKeys,
		userId,
		"check-has-client-with-same-name",
		name,
	],
};

export const getAllClientsQueryOptions = (data: { userId: string }) =>
	queryOptions({
		queryKey: clientQueryKeys.all(data.userId),
		queryFn: () =>
			getAllClients({
				data: { userId: data.userId },
			}),
	});

export const getClientByIdQueryOptions = (data: {
	userId: string;
	id: string;
}) =>
	queryOptions({
		queryKey: clientQueryKeys.byId(data.userId, data.id),
		queryFn: () =>
			getClientById({
				data: { userId: data.userId, id: data.id },
			}),
	});

export const upsertClientMutationOptions = (data: {
	userId: string;
	editId?: string;
	onSuccess?: () => void;
}) =>
	mutationOptions({
		mutationFn: (formData: ClientUpsertForm) => {
			return upsertClient({
				data: {
					...formData,
					userId: data.userId,
					id: data.editId ?? undefined,
				},
			});
		},
		onSuccess: (_a, _b, _c, context) => {
			context.client.invalidateQueries({
				queryKey: clientQueryKeys.base,
				exact: false,
			});

			data.onSuccess?.();
		},
	});

export const checkHasClientWithSameNameQueryOptions = (data: {
	userId: string;
	name: string;
}) =>
	queryOptions({
		queryKey: clientQueryKeys.checkHasClientWithSameName(
			data.userId,
			data.name,
		),
		queryFn: () =>
			checkHasClientWithSameName({
				data: {
					userId: data.userId,
					name: data.name,
				},
			}),
	});

export const removeClientMutationOptions = (data: {
	id: string;
	userId: string;
	onSuccess?: () => void;
}) =>
	mutationOptions({
		mutationFn: () =>
			removeClient({
				data: { userId: data.userId, id: data.id },
			}),
		onSuccess: (_a, _b, _c, context) => {
			context.client.invalidateQueries({
				queryKey: clientQueryKeys.base,
				exact: false,
			});

			data.onSuccess?.();
		},
	});
