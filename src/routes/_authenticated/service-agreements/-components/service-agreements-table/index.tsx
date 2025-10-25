import { DataTable } from "@/lib/components/data-table";
import type { DataTableColumn } from "@/lib/components/data-table/types";
import { useServerQuery } from "@/lib/hooks/use-server-query";
import { getAllServiceAgreementsQueryOptions } from "@/lib/query-options/service-agreements.optionts";
import type { ServiceAgreementSelect } from "@/lib/schemas/service-agreements.schemas";
import { Route } from "@/routes/_authenticated/service-agreements";

const columns: DataTableColumn<ServiceAgreementSelect>[] = [
	{
		header: "Title",
		accessorKey: "title",
	},
	{
		header: "Description",
		accessorKey: "description",
	},
	{
		header: "Rate Amount",
		accessorKey: "rateAmount",
	},
	{
		header: "Rate Currency",
		accessorKey: "rateCurrency",
	},
	{
		header: "Status",
		accessorKey: "status",
	},
	{
		header: "Client",
		accessorKey: "clientId",
	},
];

export const ServiceAgreementsTable = () => {
	const { user } = Route.useLoaderData();
	const navigate = Route.useNavigate();

	const { data: serviceAgreements } = useServerQuery(
		getAllServiceAgreementsQueryOptions({ userId: user.id }),
	);

	return (
		<DataTable
			data={serviceAgreements}
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
