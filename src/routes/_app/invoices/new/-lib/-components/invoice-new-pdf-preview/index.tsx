import { FileTextIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import type { InvoiceNewPDFPreviewProps } from "./types";

export const InvoiceNewPDFPreview = ({
	pdfInstance,
	clientId,
	services,
}: InvoiceNewPDFPreviewProps) => {
	// weird fix to force re-render the PDFViewer when the client or services change
	// yanked from https://stackoverflow.com/questions/79583113/typeerror-eo-is-not-a-function-when-deleting-in-react-pdf
	const count = useRef(0);
	useEffect(() => {
		if (!clientId || !services?.length) {
			return;
		}

		count.current++;
	}, [clientId, services?.length]);

	const hasPdf = pdfInstance?.url && clientId && services?.length;

	return (
		<div className="flex items-center justify-center bg-muted p-4">
			<div className="max-w-3xl size-full rounded-lg overflow-hidden border border-border bg-background">
				{hasPdf ? (
					<iframe
						title="Invoice PDF Preview"
						key={count.current}
						className="size-full"
						src={pdfInstance.url ?? ""}
					/>
				) : (
					<div className="size-full flex flex-col gap-2 items-center justify-center text-muted-foreground">
						<FileTextIcon className="size-13" />
						<h5>PDF Preview</h5>
						<span className="text-xs">
							Your invoice will appear here as you fill in the form
						</span>
					</div>
				)}
			</div>
		</div>
	);
};
