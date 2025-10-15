import { createFileRoute } from "@tanstack/react-router";
import { getAllClientsQueryOptions } from "@/lib/query-options/client.query-options";
import { CustomersTable } from "./_components/customers-table";

export const Route = createFileRoute("/_authenticated/customers/")({
	component: RouteComponent,
	loader: async ({ context }) => {
		await context.queryClient.prefetchQuery(
			getAllClientsQueryOptions({ user: context.user }),
		);

		return { user: context.user };
	},
});

function RouteComponent() {
	return (
		<div className="w-full">
			<CustomersTable />
		</div>
	);
}
