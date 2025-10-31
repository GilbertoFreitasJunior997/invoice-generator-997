import { createFileRoute } from "@tanstack/react-router";
import { invoiceGenerationFormSchema } from "@/lib/schemas/invoice.schemas";
import { useAppForm } from "@/lib/utils/forms.utils";
import { invoiceNewFormDefaultValues } from "./-components/consts";
import { InvoiceNewForm } from "./-components/invoice-new-form";
import { InvoiceNewPDFPreview } from "./-components/invoice-new-pdf-preview";

export const Route = createFileRoute("/_app/invoices/new/")({
	ssr: "data-only",
	loader: ({ context }) => ({
		user: context.user,
	}),
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = Route.useNavigate();

	const form = useAppForm({
		defaultValues: invoiceNewFormDefaultValues,
		validators: {
			onChange: invoiceGenerationFormSchema,
		},
		onSubmit: async () => {
			await new Promise((resolve) => setTimeout(resolve, 5000));
			form.reset();

			navigate({
				to: "/invoices",
			});
		},
	});

	return (
		<div className="h-full overflow-auto flex flex-col">
			<h1>Create Invoice</h1>

			<div className="flex gap-2 w-full grow">
				<InvoiceNewForm form={form} />

				<InvoiceNewPDFPreview form={form} />
			</div>
		</div>
	);
}
