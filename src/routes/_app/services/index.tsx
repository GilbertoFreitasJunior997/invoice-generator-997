import { createFileRoute } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { Button } from "@/lib/components/button";
import { entitySearchParamsSchema } from "@/lib/utils/search-params.utils";
import { ServicesForm } from "./-components/services-form";
import { ServicesRemoveModal } from "./-components/services-remove-modal";
import { ServicesTable } from "./-components/services-table";

export const Route = createFileRoute("/_app/services/")({
	validateSearch: entitySearchParamsSchema,
	component: RouteComponent,
	loader: async ({ context }) => {
		return { user: context.user };
	},
});

function RouteComponent() {
	const navigate = Route.useNavigate();

	return (
		<div>
			<div className="flex justify-end mb-3">
				<Button
					onClick={() => {
						navigate({ search: { isCreating: true } });
					}}
					size="sm"
				>
					<PlusIcon className="size-4" />
					Add Service
				</Button>
			</div>

			<ServicesTable />

			<ServicesForm />

			<ServicesRemoveModal />
		</div>
	);
}
