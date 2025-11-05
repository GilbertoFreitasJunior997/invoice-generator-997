import { mutationOptions, queryOptions } from "@tanstack/react-query";
import type { ClientUpsertForm } from "../schemas/client.schemas";
import {
	checkHasClientWithSameName,
	getAllActiveClients,
	getAllClients,
	getClientById,
	removeClient,
	upsertClient,
} from "../services/client.service";
import { invoiceQueryKeys } from "./invoice.query-options";

const baseKeys = ["clients"] as const;
const clientQueryKeys = {
	base: baseKeys,
	all: (userId: string) => [...baseKeys, userId],
	allActive: (userId: string) => [...baseKeys, userId, "active"],
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

export const getAllActiveClientsQueryOptions = (data: { userId: string }) =>
	queryOptions({
		queryKey: clientQueryKeys.allActive(data.userId),
		queryFn: () =>
			getAllActiveClients({
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
		mutationFn: (formData: ClientUpsertForm) =>
			upsertClient({
				data: {
					...formData,
					userId: data.userId,
					id: data.editId,
				},
			}),
		onSuccess: (_a, _b, _c, context) => {
			context.client.invalidateQueries({
				queryKey: clientQueryKeys.base,
				exact: false,
			});
			context.client.invalidateQueries({
				queryKey: invoiceQueryKeys.base,
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
			context.client.invalidateQueries({
				queryKey: invoiceQueryKeys.base,
				exact: false,
			});

			data.onSuccess?.();
		},
	});
