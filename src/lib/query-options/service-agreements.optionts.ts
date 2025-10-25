import { mutationOptions, queryOptions } from "@tanstack/react-query";
import type { ServiceAgreementUpsertForm } from "../schemas/service-agreements.schemas";
import {
	getAllServiceAgreements,
	getServiceAgreementById,
	removeServiceAgreement,
	upsertServiceAgreement,
} from "../services/service-agreements.service";

export const getAllServiceAgreementsQueryOptions = (data: { userId: string }) =>
	queryOptions({
		queryKey: ["service-agreements", data.userId],
		queryFn: () =>
			getAllServiceAgreements({
				data: { userId: data.userId },
			}),
	});

export const getServiceAgreementByIdQueryOptions = (data: {
	userId: string;
	id: string;
}) =>
	queryOptions({
		queryKey: ["service-agreements", data.userId, data.id],
		queryFn: () =>
			getServiceAgreementById({
				data: { userId: data.userId, id: data.id },
			}),
	});

export const upsertServiceAgreementMutationOptions = (data: {
	userId: string;
	clientId: string;
	id?: string;
	onSuccess?: () => void;
}) =>
	mutationOptions({
		mutationFn: (formData: ServiceAgreementUpsertForm) => {
			return upsertServiceAgreement({
				data: {
					...formData,
					userId: data.userId,
					clientId: data.clientId,
					id: formData.id,
				},
			});
		},
		onSuccess: (_a, _b, _c, context) => {
			context.client.invalidateQueries({
				queryKey: ["service-agreements"],
				exact: false,
			});

			data.onSuccess?.();
		},
	});

export const removeServiceAgreementMutationOptions = (data: {
	id: string;
	userId: string;
	onSuccess?: () => void;
}) =>
	mutationOptions({
		mutationFn: () =>
			removeServiceAgreement({
				data: { userId: data.userId, id: data.id },
			}),
		onSuccess: (_a, _b, _c, context) => {
			context.client.invalidateQueries({
				queryKey: ["service-agreements"],
				exact: false,
			});

			data.onSuccess?.();
		},
	});
