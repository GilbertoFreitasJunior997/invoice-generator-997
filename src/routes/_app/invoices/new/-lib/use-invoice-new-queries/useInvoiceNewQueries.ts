import { useServerQuery } from "@/lib/hooks/use-server-query";
import { getAllClientsQueryOptions } from "@/lib/query-options/client.query-options";
import { getAllServicesQueryOptions } from "@/lib/query-options/service.query-options";
import { Route } from "../../index";

export const useInvoiceNewQueries = () => {
	const { user } = Route.useLoaderData();

	const clientsQuery = useServerQuery({
		...getAllClientsQueryOptions({
			userId: user.id,
		}),
	});

	const servicesQuery = useServerQuery({
		...getAllServicesQueryOptions({
			userId: user.id,
		}),
	});

	return {
		clientsQuery,
		servicesQuery,
	};
};
