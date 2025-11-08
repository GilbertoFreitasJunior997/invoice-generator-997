import { queryOptions } from "@tanstack/react-query";
import {
	getCurrentUser,
	getUserNextInvoiceNumber,
} from "../services/user.service";

const baseKeys = ["user"] as const;
export const userQueryKeys = {
	base: baseKeys,
	currentUser: (pathname: string) => [...baseKeys, pathname, "current-user"],
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

export const getCurrentUserQueryOptions = (pathname: string) =>
	queryOptions({
		queryKey: userQueryKeys.currentUser(pathname),
		queryFn: () => getCurrentUser({ data: { pathname } }),
	});
