import { DataTable } from "@/lib/components/data-table";
import type { DataTableColumn } from "@/lib/components/data-table/types";
import { useServerQuery } from "@/lib/hooks/use-server-query";
import { getAllClientsQueryOptions } from "@/lib/query-options/client.query-options";
import type { ClientSelect } from "@/lib/schemas/client.schemas";
import { Route } from "@/routes/_authenticated/clients";

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

export const ClientsTable = () => {
	const { user } = Route.useLoaderData();
	const navigate = Route.useNavigate();

	const { data: clients } = useServerQuery(getAllClientsQueryOptions({ user }));

	return (
		<DataTable
			data={clients}
			columns={columns}
			onEditClick={(data) => {
				navigate({
					search: {
						editId: data.id,
					},
				});
			}}
			onDeleteClick={(data) => {
				navigate({
					search: {
						removeId: data.id,
					},
				});
			}}
		/>
	);
};
