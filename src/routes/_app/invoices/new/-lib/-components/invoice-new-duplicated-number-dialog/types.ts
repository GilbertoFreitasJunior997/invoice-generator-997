import type {
	InvoiceGenerationForm,
	InvoiceSelect,
} from "@/lib/schemas/invoice.schemas";

export type InvoiceNewDuplicatedNumberDialogData = {
	formData: InvoiceGenerationForm;
	invoiceWithSameNumber: InvoiceSelect;
};

export type InvoiceNewDuplicatedNumberDialogProps = {
	data?: InvoiceNewDuplicatedNumberDialogData;

	onUseDifferentNumber: () => void;
	onUseDuplicatedNumber: () => void;
};
