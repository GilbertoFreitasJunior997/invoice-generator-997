import { createFileRoute } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { z } from "zod";
import { Button } from "@/lib/components/button";
import { ClientsForm } from "./-components/clients-form";
import { ClientsRemoveModal } from "./-components/clients-remove-modal";
import { ClientsTable } from "./-components/clients-table";

const searchParamsSchema = z.object({
	isCreating: z.boolean().optional(),
	editId: z.string().optional(),
	removeId: z.string().optional(),
});

export const Route = createFileRoute("/_authenticated/clients/")({
	validateSearch: searchParamsSchema,
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
					Add Client
				</Button>
			</div>

			<ClientsTable />

			<ClientsForm />

			<ClientsRemoveModal />
		</div>
	);
}
