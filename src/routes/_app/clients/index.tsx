import { createFileRoute } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { Button } from "@/lib/components/button";
import { entitySearchParamsSchema } from "@/lib/utils/search-params.utils";
import { ClientsForm } from "./-components/clients-form";
import { ClientsRemoveModal } from "./-components/clients-remove-modal";
import { ClientsTable } from "./-components/clients-table";

export const Route = createFileRoute("/_app/clients/")({
	validateSearch: entitySearchParamsSchema,
	component: RouteComponent,
	loader: ({ context }) => ({ user: context.user }),
});

function RouteComponent() {
	const navigate = Route.useNavigate();

	return (
		<div className="w-full">
			<div className="flex justify-end mb-3">
				<Button
					onClick={() => {
						navigate({ search: { isCreating: true } });
					}}
					size="sm"
				>
					<PlusIcon className="size-4" />
					Add Client
				</Button>
			</div>

			<ClientsTable />

			<ClientsForm />

			<ClientsRemoveModal />
		</div>
	);
}
