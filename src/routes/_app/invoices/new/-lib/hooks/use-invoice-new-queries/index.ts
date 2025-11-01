import { getRouteApi } from "@tanstack/react-router";
import { useServerQuery } from "@/lib/hooks/use-server-query";
import { getAllClientsQueryOptions } from "@/lib/query-options/client.query-options";
import { getAllServicesQueryOptions } from "@/lib/query-options/service.query-options";
import { getUserNextInvoiceNumberQueryOptions } from "@/lib/query-options/user.query-options";

const Route = getRouteApi("/_app/invoices/new/");

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

	const nextInvoiceNumberQuery = useServerQuery({
		...getUserNextInvoiceNumberQueryOptions({
			userId: user.id,
		}),
	});

	return {
		clientsQuery,
		servicesQuery,
		nextInvoiceNumberQuery,
	};
};
