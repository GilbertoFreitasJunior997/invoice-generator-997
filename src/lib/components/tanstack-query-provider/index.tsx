import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

export const getContext = () => {
	const queryClient = new QueryClient();
	return {
		queryClient,
	};
};

type ProviderProps = {
	children: ReactNode;
	queryClient: QueryClient;
};

export const Provider = ({ children, queryClient }: ProviderProps) => {
	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};
