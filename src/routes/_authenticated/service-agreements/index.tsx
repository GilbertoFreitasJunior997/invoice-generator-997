import { createFileRoute } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { Button } from "@/lib/components/button";
import { entitySearchParamsSchema } from "@/lib/utils/search-params.utils";
import { ServiceAgreementsForm } from "./-components/service-agreements-form";
import { ServiceAgreementsTable } from "./-components/service-agreements-table";

export const Route = createFileRoute("/_authenticated/service-agreements/")({
	validateSearch: entitySearchParamsSchema,
	component: RouteComponent,
	loader: async ({ context }) => {
		return { user: context.user };
	},
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
					Add Service Agreement
				</Button>
			</div>

			<ServiceAgreementsTable />

			<ServiceAgreementsForm />
		</div>
	);
}
