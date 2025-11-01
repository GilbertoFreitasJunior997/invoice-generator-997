import { getRouteApi } from "@tanstack/react-router";
import { Loader2Icon } from "lucide-react";
import { useServerQuery } from "@/lib/hooks/use-server-query";
import { getInvoicesQueryOptions } from "@/lib/query-options/invoice.query-options";

const Route = getRouteApi("/_app/invoices/");

export const InvoiceList = () => {
	const { user } = Route.useLoaderData();
	const { data: invoices, isFetching: isInvoicesLoading } = useServerQuery(
		getInvoicesQueryOptions({ userId: user.id }),
	);

	return (
		<div>
			<h1>Invoice List</h1>

			{isInvoicesLoading ? (
				<div>
					<Loader2Icon className="size-4 animate-spin" />
				</div>
			) : (
				<div>
					{invoices?.map((invoice) => (
						<div key={invoice.id}>
							<h1>{invoice.fileName}</h1>
						</div>
					))}
				</div>
			)}
		</div>
	);
};
