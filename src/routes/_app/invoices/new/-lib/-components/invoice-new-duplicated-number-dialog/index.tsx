import { Button } from "@/lib/components/button";
import { Dialog } from "@/lib/components/dialog";
import type { InvoiceNewDuplicatedNumberDialogProps } from "./types";

export const InvoiceNewDuplicatedNumberDialog = ({
	data,
	onUseDifferentNumber,
	onUseDuplicatedNumber,
}: InvoiceNewDuplicatedNumberDialogProps) => {
	const isOpen = !!data;

	return (
		<Dialog.Root open={isOpen}>
			<Dialog.Content className="w-lg" showCloseButton={false}>
				<Dialog.Header>Attention!</Dialog.Header>
				<Dialog.Description>
					The invoice number you have entered is already in use. If you keep
					this duplicated number, it might cause conflicts with other invoices.
				</Dialog.Description>
				<Dialog.Footer>
					<Dialog.Close asChild>
						<Button variant="outline" onClick={onUseDifferentNumber}>
							I'll use a different number
						</Button>
					</Dialog.Close>

					<Button variant="destructive" onClick={onUseDuplicatedNumber}>
						I'm aware of the risks
					</Button>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
	);
};
