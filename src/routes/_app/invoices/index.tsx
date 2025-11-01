import { createFileRoute } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { Button } from "@/lib/components/button";
import { InvoiceList } from "./-lib/components/invoice-list";

export const Route = createFileRoute("/_app/invoices/")({
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
						navigate({
							to: "/invoices/new",
						});
					}}
					size="sm"
				>
					<PlusIcon className="size-4" />
					Create Invoice
				</Button>
			</div>

			<InvoiceList />
		</div>
	);
}
