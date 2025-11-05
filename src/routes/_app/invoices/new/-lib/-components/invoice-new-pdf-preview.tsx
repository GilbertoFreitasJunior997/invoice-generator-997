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
		<div className="grow flex items-center justify-center">
			<div className="max-w-3xl size-full rounded-lg overflow-hidden border border-muted bg-muted dark:bg-muted/20">
				{hasPdf ? (
					<iframe
						title="Invoice PDF Preview"
						key={count.current}
						className="size-full"
						src={pdfInstance.url ?? ""}
					/>
				) : (
					<div className="size-full" />
				)}
			</div>
		</div>
	);
};
