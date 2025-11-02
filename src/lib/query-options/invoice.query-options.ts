import { mutationOptions, queryOptions } from "@tanstack/react-query";
import type {
	InvoiceGenerationForm,
	InvoiceNewFirstInvoiceForm,
} from "../schemas/invoice.schemas";
import {
	checkIsUserFirstInvoice,
	createInvoice,
	getInvoices,
} from "../services/invoice.service";
import { updateUserCurrentInvoiceNumber } from "../services/user.service";
import { userQueryKeys } from "./user.query-options";

const baseKeys = ["invoices"] as const;
export const invoiceQueryKeys = {
	base: baseKeys,
	all: (userId: string) => [...baseKeys, userId],
	isUserFirstInvoice: (userId: string) => [
		...baseKeys,
		userId,
		"is-user-first-invoice",
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

			data.onSuccess?.();
		},
	});

export const getInvoicesQueryOptions = (data: { userId: string }) =>
	queryOptions({
		queryKey: invoiceQueryKeys.all(data.userId),
		queryFn: () => getInvoices({ data: { userId: data.userId } }),
	});

export const checkIsUserFirstInvoiceQueryOptions = (data: { userId: string }) =>
	queryOptions({
		queryKey: invoiceQueryKeys.isUserFirstInvoice(data.userId),
		queryFn: () => checkIsUserFirstInvoice({ data: { userId: data.userId } }),
	});

export const updateUserCurrentInvoiceNumberMutationOptions = (data: {
	userId: string;
}) =>
	mutationOptions({
		mutationFn: (formData: InvoiceNewFirstInvoiceForm) =>
			updateUserCurrentInvoiceNumber({
				data: {
					userId: data.userId,
					currentInvoiceNumber: formData.currentInvoiceNumber,
				},
			}),
		onSuccess: (_a, _b, _c, context) => {
			context.client.invalidateQueries({
				queryKey: userQueryKeys.nextInvoiceNumber(data.userId),
				exact: false,
			});
		},
	});
