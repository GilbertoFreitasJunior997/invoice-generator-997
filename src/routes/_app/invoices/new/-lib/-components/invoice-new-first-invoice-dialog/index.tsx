import { useStore } from "@tanstack/react-form";
import { getRouteApi } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Dialog } from "@/lib/components/dialog";
import { useServerMutation } from "@/lib/hooks/use-server-query";
import { updateUserCurrentInvoiceNumberMutationOptions } from "@/lib/query-options/invoice.query-options";
import { invoiceNewFirstInvoiceFormSchema } from "@/lib/schemas/invoice.schemas";
import { useAppForm } from "@/lib/utils/forms.utils";
import type { InvoiceNewFirstInvoiceDialogProps } from "./types";

const Route = getRouteApi("/_app/invoices/new/");

export const InvoiceNewFirstInvoiceDialog = ({
	isOpen,
	onOpenChange,
}: InvoiceNewFirstInvoiceDialogProps) => {
	const { user } = Route.useLoaderData();

	const { mutateAsync: updateInvoiceNumber, isPending: isUpdating } =
		useServerMutation(
			updateUserCurrentInvoiceNumberMutationOptions({ userId: user.id }),
		);

	const form = useAppForm({
		defaultValues: {
			currentInvoiceNumber: 1,
			isFirstInvoice: true,
		},
		validators: {
			onChange: invoiceNewFirstInvoiceFormSchema,
		},
		onSubmit: async ({ value }) => {
			await updateInvoiceNumber({
				currentInvoiceNumber: value.isFirstInvoice
					? 0
					: value.currentInvoiceNumber,
				isFirstInvoice: value.isFirstInvoice,
			});

			onOpenChange(false);
		},
	});

	const isFirstInvoice = useStore(form.store, (s) => s.values.isFirstInvoice);

	return (
		<Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
			<Dialog.Content
				showCloseButton={false}
				closeOnInteractOutside={false}
				className="w-lg"
			>
				<Dialog.Header>
					<Dialog.Title>Create Your First Invoice</Dialog.Title>

					<Dialog.Description>
						For proper numbering, we need to know if this is your first invoice
						ever or if you've created invoices outside this app.
					</Dialog.Description>
				</Dialog.Header>

				<form.Root form={form}>
					<form.Group className="gap-0">
						<form.AppField
							name="isFirstInvoice"
							children={(field) => (
								<field.Checkbox
									label="This is my first invoice ever!"
									rootClassName="mb-4"
								/>
							)}
						/>

						<AnimatePresence>
							{!isFirstInvoice && (
								<motion.div
									initial={{ height: 0, opacity: 0 }}
									animate={{ height: "auto", opacity: 1 }}
									exit={{ height: 0, opacity: 0 }}
									transition={{ duration: 0.2 }}
								>
									<form.AppField
										name="currentInvoiceNumber"
										children={(field) => (
											<field.NumberInput
												label="Most Recent Invoice Number"
												rootClassName="mb-4"
											/>
										)}
									/>
								</motion.div>
							)}
						</AnimatePresence>

						<Dialog.Footer>
							<form.SubmitButton disabled={isUpdating}>
								{isUpdating ? "Saving..." : "Continue"}
							</form.SubmitButton>
						</Dialog.Footer>
					</form.Group>
				</form.Root>
			</Dialog.Content>
		</Dialog.Root>
	);
};
