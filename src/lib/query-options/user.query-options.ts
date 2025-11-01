import { queryOptions } from "@tanstack/react-query";
import { getUserNextInvoiceNumber } from "../services/user.service";

const baseKeys = ["user"] as const;
export const userQueryKeys = {
	base: baseKeys,
	nextInvoiceNumber: (userId: string) => [
		...baseKeys,
		userId,
		"next-invoice-number",
	],
};

export const getUserNextInvoiceNumberQueryOptions = (data: {
	userId: string;
}) =>
	queryOptions({
		queryKey: userQueryKeys.nextInvoiceNumber(data.userId),
		queryFn: () =>
			getUserNextInvoiceNumber({
				data: { userId: data.userId },
			}),
	});
