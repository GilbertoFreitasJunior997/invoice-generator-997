import { mutationOptions, queryOptions } from "@tanstack/react-query";
import type { ServiceUpsertForm } from "../schemas/service.schemas";
import {
	deleteService,
	getAllServices,
	getServiceById,
	upsertService,
} from "../services/service.service";
import { invoiceQueryKeys } from "./invoice.query-options";

const baseKeys = ["services"] as const;
export const serviceQueryKeys = {
	base: baseKeys,
	all: (userId: string) => [...baseKeys, userId],
	byId: (userId: string, id: string) => [...baseKeys, userId, id],
};

export const getAllServicesQueryOptions = (data: { userId: string }) =>
	queryOptions({
		queryKey: serviceQueryKeys.all(data.userId),
		queryFn: () =>
			getAllServices({
				data: { userId: data.userId },
			}),
	});

export const getServiceByIdQueryOptions = (data: {
	userId: string;
	id: string;
}) =>
	queryOptions({
		queryKey: serviceQueryKeys.byId(data.userId, data.id),
		queryFn: () =>
			getServiceById({
				data: { userId: data.userId, id: data.id },
			}),
	});

export const upsertServiceMutationOptions = (data: {
	userId: string;
	editId?: string;
	onSuccess?: () => void;
}) =>
	mutationOptions({
		mutationFn: (formData: ServiceUpsertForm) =>
			upsertService({
				data: { ...formData, userId: data.userId, id: data.editId },
			}),
		onSuccess: (_a, _b, _c, context) => {
			context.client.invalidateQueries({
				queryKey: serviceQueryKeys.base,
				exact: false,
			});
			context.client.invalidateQueries({
				queryKey: invoiceQueryKeys.base,
				exact: false,
			});

			data.onSuccess?.();
		},
	});

export const deleteServiceMutationOptions = (data: {
	id: string;
	userId: string;
	onSuccess?: () => void;
}) =>
	mutationOptions({
		mutationFn: () =>
			deleteService({ data: { userId: data.userId, id: data.id } }),
		onSuccess: (_a, _b, _c, context) => {
			context.client.invalidateQueries({
				queryKey: serviceQueryKeys.base,
				exact: false,
			});
			context.client.invalidateQueries({
				queryKey: invoiceQueryKeys.base,
				exact: false,
			});

			data.onSuccess?.();
		},
	});
