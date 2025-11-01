import { mutationOptions, queryOptions } from "@tanstack/react-query";
import type { InvoiceGenerationForm } from "../schemas/invoice.schemas";
import { createInvoice, getInvoices } from "../services/invoice.service";
import { userQueryKeys } from "./user.query-options";

const baseKeys = ["invoices"] as const;
export const invoiceQueryKeys = {
	base: baseKeys,
	all: (userId: string) => [...baseKeys, userId],
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
