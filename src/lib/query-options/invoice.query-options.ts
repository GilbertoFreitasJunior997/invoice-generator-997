import { mutationOptions, queryOptions } from "@tanstack/react-query";
import type { PaginationServiceParams } from "../schemas/global.schemas";
import type { InvoiceGenerationForm } from "../schemas/invoice.schemas";
import {
	createInvoice,
	getInvoiceByInvoiceNumber,
	getInvoicesPaginatedWithRelations,
} from "../services/invoice.service";
import { userQueryKeys } from "./user.query-options";

const baseKeys = ["invoices"] as const;
export const invoiceQueryKeys = {
	base: baseKeys,
	paginatedWithRelations: (paginateParams: PaginationServiceParams) => [
		...baseKeys,
		paginateParams.userId,
		paginateParams.page,
		paginateParams.pageSize,
		"paginated-with-relations",
	],
	isUserFirstInvoice: (userId: string) => [
		...baseKeys,
		userId,
		"is-user-first-invoice",
	],
	byInvoiceNumber: (userId: string, invoiceNumber: number) => [
		...baseKeys,
		userId,
		invoiceNumber,
		"by-invoice-number",
	],
};

export const createInvoiceMutationOptions = (data: {
	userId: string;
	onSuccess?: () => void;
}) =>
	mutationOptions({
		mutationFn: (formData: InvoiceGenerationForm) =>
			createInvoice({
				data: { ...formData, userId: data.userId },
			}),
		onSuccess: (_a, _b, _c, context) => {
			context.client.invalidateQueries({
				queryKey: invoiceQueryKeys.base,
				exact: false,
			});

			context.client.invalidateQueries({
				queryKey: userQueryKeys.nextInvoiceNumber(data.userId),
				exact: false,
			});

			context.client.invalidateQueries({
				queryKey: invoiceQueryKeys.isUserFirstInvoice(data.userId),
				exact: false,
			});

			data.onSuccess?.();
		},
	});

export const getInvoicesPaginatedWithRelationsQueryOptions = (
	data: PaginationServiceParams,
) =>
	queryOptions({
		queryKey: invoiceQueryKeys.paginatedWithRelations(data),
		queryFn: () =>
			getInvoicesPaginatedWithRelations({
				data,
			}),
	});

export const getInvoiceByInvoiceNumberQueryOptions = (data: {
	userId: string;
	invoiceNumber: number;
}) =>
	queryOptions({
		queryKey: invoiceQueryKeys.byInvoiceNumber(data.userId, data.invoiceNumber),
		queryFn: () =>
			getInvoiceByInvoiceNumber({
				data: { userId: data.userId, invoiceNumber: data.invoiceNumber },
			}),
	});
