import { useStore } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { FileTextIcon } from "lucide-react";
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
	const dueDate = useStore(form.store, (s) => s.values.dueDate);

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
		dueDate,
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
			<div className="h-full grid grid-cols-[430px_1fr]">
				<div className="flex flex-col gap-2 border-r border-border p-4 overflow-hidden">
					<h1 className="text-xl font-semibold">Create Invoice</h1>

					<div className="flex flex-col gap-6 overflow-y-auto">
						<InvoiceNewForm form={form} />

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
										<FileTextIcon />
										{isLoading ? "Creating Invoice..." : "Create Invoice"}
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

			<InvoiceNewDuplicatedNumberDialog
				data={duplicatedNumberDialogData}
				onUseDifferentNumber={handleUseDifferentNumber}
				onUseDuplicatedNumber={handleUseDuplicatedNumber}
			/>
		</>
	);
}
