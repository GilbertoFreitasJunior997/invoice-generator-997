import { DataTable } from "@/lib/components/data-table";
import type { DataTableColumn } from "@/lib/components/data-table/types";
import { useServerQuery } from "@/lib/hooks/use-server-query";
import { getAllServicesQueryOptions } from "@/lib/query-options/service.query-options";
import type { ServiceSelect } from "@/lib/schemas/service.schemas";
import { Route } from "@/routes/_authenticated/services";

const columns: DataTableColumn<ServiceSelect>[] = [
	{
		header: "Name",
		accessorKey: "name",
	},
	{
		header: "Description",
		accessorKey: "description",
	},
	{
		header: "Rate",
		accessorKey: "rate",
	},
	{
		header: "Currency",
		accessorKey: "currency",
	},
];

export const ServicesTable = () => {
	const { user } = Route.useLoaderData();
	const navigate = Route.useNavigate();

	const { data: services } = useServerQuery(
		getAllServicesQueryOptions({ userId: user.id }),
	);

	return (
		<DataTable
			data={services}
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
