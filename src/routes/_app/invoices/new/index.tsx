import { useStore } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { DownloadIcon } from "lucide-react";
import type { MouseEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/lib/components/button";
import { useServerMutation } from "@/lib/hooks/use-server-query";
import { createInvoiceMutationOptions } from "@/lib/query-options/invoice.query-options";
import { invoiceGenerationFormSchema } from "@/lib/schemas/invoice.schemas";
import { downloadFile } from "@/lib/utils/download-blob";
import { useAppForm } from "@/lib/utils/forms.utils";
import { invoiceNewFormDefaultValues } from "./-lib/-components/consts";
import { InvoiceNewForm } from "./-lib/-components/invoice-new-form";
import { InvoiceNewPDFPreview } from "./-lib/-components/invoice-new-pdf-preview";
import { useInvoiceNewPDF } from "./-lib/hooks/use-invoice-new-pdf";

export const Route = createFileRoute("/_app/invoices/new/")({
	ssr: "data-only",
	loader: ({ context }) => ({
		user: context.user,
	}),
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = Route.useNavigate();
	const { user } = Route.useLoaderData();

	const { mutateAsync: createInvoiceMutation } = useServerMutation(
		createInvoiceMutationOptions({
			userId: user.id,
		}),
	);

	const form = useAppForm({
		defaultValues: invoiceNewFormDefaultValues,
		validators: {
			onChange: invoiceGenerationFormSchema,
		},
		onSubmit: async ({ value }) => {
			if (!pdfInstance?.url) {
				toast.error("Please select a client and services to create an invoice");
				return;
			}

			const invoice = await createInvoiceMutation({
				fileName: value.fileName,
				clientId: value.clientId,
				servicesIds: value.servicesIds,
			});

			downloadFile({
				url: pdfInstance.url,
				filename: `${invoice.fileName}.pdf`,
			});

			form.reset();

			navigate({
				to: "/invoices",
			});
		},
	});

	const clientId = useStore(form.store, (s) => s.values.clientId);
	const servicesIds = useStore(form.store, (s) => s.values.servicesIds);

	const { pdfInstance } = useInvoiceNewPDF({ clientId, servicesIds });

	const handleCreateInvoiceClick = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		e.stopPropagation();

		void form.handleSubmit();
	};

	return (
		<div className="h-full overflow-auto flex flex-col">
			<h1>Create Invoice</h1>

			<div className="flex gap-2 w-full grow">
				<div className="w-[30%] max-w-[400px] flex flex-col gap-2">
					<InvoiceNewForm form={form} />

					<div>
						<form.Subscribe
							selector={(state) => ({ isSubmitting: state.isSubmitting })}
							children={({ isSubmitting }) => (
								<Button
									className="w-full"
									onClick={handleCreateInvoiceClick}
									disabled={isSubmitting}
								>
									{isSubmitting ? "Creating Invoice..." : "Create Invoice"}
									<DownloadIcon />
								</Button>
							)}
						/>
					</div>
				</div>

				<InvoiceNewPDFPreview
					pdfInstance={pdfInstance}
					clientId={clientId}
					servicesIds={servicesIds}
				/>
			</div>
		</div>
	);
}
