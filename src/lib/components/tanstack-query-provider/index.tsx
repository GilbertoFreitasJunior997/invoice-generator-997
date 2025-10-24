import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

export const getContext = () => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
				staleTime: 60 * 1000 * 5, // 5 minutes
			},
		},
	});
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
