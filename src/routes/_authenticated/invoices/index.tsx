import { createFileRoute } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { Button } from "@/lib/components/button";
import { entitySearchParamsSchema } from "@/lib/utils/search-params.utils";
import { InvoiceGenerationForm } from "./-components/invoice-generation-form";

export const Route = createFileRoute("/_authenticated/invoices/")({
	validateSearch: entitySearchParamsSchema.pick({ isCreating: true }),
	ssr: false,
	loader: async ({ context }) => {
		return {
			user: context.user,
		};
	},
	component: RouteComponent,
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
					Create Invoice
				</Button>
			</div>

			<InvoiceGenerationForm />
		</div>
	);
}
