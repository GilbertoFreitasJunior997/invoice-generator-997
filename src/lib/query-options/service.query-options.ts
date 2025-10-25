import { mutationOptions, queryOptions } from "@tanstack/react-query";
import type { ServiceUpsertForm } from "../schemas/service.schemas";
import {
	deleteService,
	getAllServices,
	getServiceById,
	upsertService,
} from "../services/service.service";

export const getAllServicesQueryOptions = (data: { userId: string }) =>
	queryOptions({
		queryKey: ["services", data.userId],
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
		queryKey: ["services", data.userId, data.id],
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
				queryKey: ["services"],
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
				queryKey: ["services"],
				exact: false,
			});

			data.onSuccess?.();
		},
	});
