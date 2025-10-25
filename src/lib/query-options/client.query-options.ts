import { mutationOptions, queryOptions } from "@tanstack/react-query";
import type { ClientUpsertForm } from "../schemas/client.schemas";
import {
	checkHasClientWithSameCompanyName,
	getAllClients,
	getClientById,
	removeClient,
	upsertClient,
} from "../services/client.service";

export const getAllClientsQueryOptions = (data: { userId: string }) =>
	queryOptions({
		queryKey: ["clients", data.userId],
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
		queryKey: ["clients", data.userId, data.id],
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
				queryKey: ["clients"],
				exact: false,
			});

			data.onSuccess?.();
		},
	});

export const checkHasClientWithSameCompanyNameQueryOptions = (data: {
	userId: string;
	companyName: string;
}) =>
	queryOptions({
		queryKey: [
			"clients",
			data.userId,
			"check-has-client-with-same-company-name",
			data.companyName,
		],
		queryFn: () =>
			checkHasClientWithSameCompanyName({
				data: {
					userId: data.userId,
					companyName: data.companyName,
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
				queryKey: ["clients"],
				exact: false,
			});

			data.onSuccess?.();
		},
	});
