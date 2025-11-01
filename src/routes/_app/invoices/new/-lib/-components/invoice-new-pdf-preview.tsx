import { useEffect, useRef } from "react";
import type { InvoiceNewPDFPreviewProps } from "./types";

export const InvoiceNewPDFPreview = ({
	pdfInstance,
	clientId,
	servicesIds,
}: InvoiceNewPDFPreviewProps) => {
	// weird fix to force re-render the PDFViewer when the client or services change
	// yanked from https://stackoverflow.com/questions/79583113/typeerror-eo-is-not-a-function-when-deleting-in-react-pdf
	const count = useRef(0);
	useEffect(() => {
		if (!clientId || !servicesIds?.length) {
			return;
		}

		count.current++;
	}, [clientId, servicesIds?.length]);

	const hasPdf = pdfInstance?.url && clientId && servicesIds?.length;

	return (
		<div className="grow flex items-center justify-center">
			{hasPdf ? (
				<iframe
					title="Invoice PDF Preview"
					key={count.current}
					className="max-w-3xl w-full h-full rounded-lg"
					src={pdfInstance.url ?? ""}
				/>
			) : (
				<div></div>
			)}
		</div>
	);
};
