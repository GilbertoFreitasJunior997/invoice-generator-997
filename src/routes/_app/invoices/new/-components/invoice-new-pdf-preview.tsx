import type { UsePDFInstance } from "@react-pdf/renderer";

type InvoiceNewPDFPreviewProps = {
	pdfInstance: UsePDFInstance;
};

export const InvoiceNewPDFPreview = ({
	pdfInstance,
}: InvoiceNewPDFPreviewProps) => {
	if (!pdfInstance.url) {
		return <div />;
	}

	return (
		<div className="flex-1 flex items-center justify-center">
			<div className="flex flex-col flex-1 h-full gap-1 max-w-3xl">
				<iframe
					src={pdfInstance.url}
					className="flex-1 h-full rounded-lg w-full"
					title="Invoice"
				/>
			</div>
		</div>
	);
};
