import { useSuspenseQuery } from "@tanstack/react-query";
import { DataTable } from "@/lib/components/data-table";
import type { DataTableColumn } from "@/lib/components/data-table/types";
import { getAllClientsQueryOptions } from "@/lib/query-options/client.query-options";
import type { ClientSelect } from "@/lib/schemas/client.schemas";
import { Route } from "@/routes/_authenticated/customers";

const columns: DataTableColumn<ClientSelect>[] = [
	{
		header: "Name",
		accessorKey: "companyName",
	},
	{
		header: "Address",
		accessorKey: "addressLine1",
	},
	{
		header: "Address 2",
		accessorKey: "addressLine2",
	},
];

export const CustomersTable = () => {
	const { user } = Route.useLoaderData();

	const { data: clients } = useSuspenseQuery(
		getAllClientsQueryOptions({ user }),
	);

	return (
		<DataTable
			columns={columns}
			onEditClick={() => {}}
			onDeleteClick={() => {}}
			data={clients}
		/>
	);
};
