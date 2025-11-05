import { useStore } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { DownloadIcon } from "lucide-react";
import { type MouseEvent, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/lib/components/button";
import {
	useServerMutation,
	useServerQuery,
} from "@/lib/hooks/use-server-query";
import {
	createInvoiceMutationOptions,
	getInvoiceByInvoiceNumberQueryOptions,
} from "@/lib/query-options/invoice.query-options";
import {
	type InvoiceGenerationForm,
	invoiceGenerationFormSchema,
} from "@/lib/schemas/invoice.schemas";
import { downloadFile } from "@/lib/utils/blobs.utils";
import { useAppForm } from "@/lib/utils/forms.utils";
import { invoiceNewFormDefaultValues } from "./-lib/-components/consts";
import { InvoiceNewDuplicatedNumberDialog } from "./-lib/-components/invoice-new-duplicated-number-dialog";
import type { InvoiceNewDuplicatedNumberDialogData } from "./-lib/-components/invoice-new-duplicated-number-dialog/types";
import { InvoiceNewForm } from "./-lib/-components/invoice-new-form";
import { InvoiceNewPDFPreview } from "./-lib/-components/invoice-new-pdf-preview";
import { useInvoiceNewPDF } from "./-lib/hooks/use-invoice-new-pdf";
import { useInvoiceNewQueries } from "./-lib/hooks/use-invoice-new-queries";

export const Route = createFileRoute("/_app/invoices/new/")({
	ssr: "data-only",
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = Route.useNavigate();
	const { user } = Route.useRouteContext();

	const [duplicatedNumberDialogData, setDuplicatedNumberDialogData] =
		useState<InvoiceNewDuplicatedNumberDialogData>();

	const { nextInvoiceNumberQuery } = useInvoiceNewQueries();
	const { data: nextInvoiceNumber, isFetching: isNextInvoiceNumberLoading } =
		nextInvoiceNumberQuery;

	const {
		mutateAsync: createInvoiceMutation,
		isPending: isCreatingInvoicePending,
	} = useServerMutation(
		createInvoiceMutationOptions({
			userId: user.id,
		}),
	);

	const handleCreateInvoice = async (formData: InvoiceGenerationForm) => {
		if (!pdfInstance?.url) {
			toast.error("Please select a client and services to create an invoice");
			return;
		}

		const invoice = await createInvoiceMutation({
			fileName: formData.fileName,
			clientId: formData.clientId,
			services: formData.services,
			invoicedAt: formData.invoicedAt,
			invoiceNumber: formData.invoiceNumber,
		});

		downloadFile({
			url: pdfInstance.url,
			filename: `${invoice.fileName}.pdf`,
		});

		navigate({
			to: "/invoices",
		});
	};

	const form = useAppForm({
		defaultValues: {
			...invoiceNewFormDefaultValues,
			invoiceNumber:
				nextInvoiceNumber ?? invoiceNewFormDefaultValues.invoiceNumber,
		},
		validators: {
			onChange: invoiceGenerationFormSchema,
		},
		onSubmit: async ({ value }) => {
			const { data: invoiceWithSameNumber } =
				await refetchInvoiceByInvoiceNumber();

			if (invoiceWithSameNumber) {
				setDuplicatedNumberDialogData({
					formData: value,
					invoiceWithSameNumber,
				});
				return;
			}

			await handleCreateInvoice(value);
		},
	});

	const invoiceNumber = useStore(form.store, (s) => s.values.invoiceNumber);
	const clientId = useStore(form.store, (s) => s.values.clientId);
	const services = useStore(form.store, (s) => s.values.services);
	const invoicedAt = useStore(form.store, (s) => s.values.invoicedAt);

	const { refetch: refetchInvoiceByInvoiceNumber } = useServerQuery(
		{
			...getInvoiceByInvoiceNumberQueryOptions({
				userId: user.id,
				invoiceNumber,
			}),
			enabled: false,
		},
		{
			shouldShowNotifications: false,
		},
	);

	const { pdfInstance } = useInvoiceNewPDF({
		invoiceNumber,
		clientId,
		services,
		invoicedAt,
	});

	const handleCreateInvoiceClick = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		e.stopPropagation();

		void form.handleSubmit();
	};

	const handleUseDifferentNumber = () => {
		setDuplicatedNumberDialogData(undefined);
	};

	const handleUseDuplicatedNumber = async () => {
		if (!duplicatedNumberDialogData) {
			toast.error("Something went wrong. Please try again.");
			return;
		}

		setDuplicatedNumberDialogData(undefined);
		await handleCreateInvoice(duplicatedNumberDialogData.formData);
	};

	return (
		<>
			<div className="h-full overflow-auto flex flex-col">
				<h1>Create Invoice</h1>
				<div className="flex gap-2 w-full grow">
					<div className="w-[30%] max-w-[400px] flex flex-col gap-2">
						<InvoiceNewForm form={form} />
						<div>
							<form.Subscribe
								selector={(state) => ({ isSubmitting: state.isSubmitting })}
								children={({ isSubmitting }) => {
									const isDisabled =
										isSubmitting ||
										isNextInvoiceNumberLoading ||
										isCreatingInvoicePending;
									const isLoading = isSubmitting || isCreatingInvoicePending;

									return (
										<Button
											className="w-full"
											onClick={handleCreateInvoiceClick}
											disabled={isDisabled}
										>
											{isLoading ? "Creating Invoice..." : "Create Invoice"}
											<DownloadIcon />
										</Button>
									);
								}}
							/>
						</div>
					</div>
					<InvoiceNewPDFPreview
						pdfInstance={pdfInstance}
						clientId={clientId}
						services={services}
					/>
				</div>
			</div>

			<InvoiceNewDuplicatedNumberDialog
				data={duplicatedNumberDialogData}
				onUseDifferentNumber={handleUseDifferentNumber}
				onUseDuplicatedNumber={handleUseDuplicatedNumber}
			/>
		</>
	);
}
