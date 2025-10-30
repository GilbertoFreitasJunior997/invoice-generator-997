import { useMutation } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/lib/components/button";
import { Dialog } from "@/lib/components/dialog";
import { removeClientMutationOptions } from "@/lib/query-options/client.query-options";
import { Route } from "../../index";

export const ClientsRemoveModal = () => {
	const { removeId } = Route.useSearch();
	const { user } = Route.useLoaderData();
	const navigate = Route.useNavigate();

	const [isSuccess, setIsSuccess] = useState(false);

	const isOpen = !!removeId;

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			navigate({ search: { removeId: undefined } });
		}
	};

	const { mutateAsync: removeClientMutation, isPending } = useMutation(
		removeClientMutationOptions({
			userId: user.id,
			id: removeId ?? "",
			onSuccess: () => {
				setIsSuccess(true);
				navigate({ search: { removeId: undefined } });
			},
		}),
	);

	useEffect(() => {
		if (!isOpen) {
			setIsSuccess(false);
		}
	}, [isOpen]);

	return (
		<Dialog.Root open={isOpen} onOpenChange={handleOpenChange} modal={true}>
			<Dialog.Content>
				<Dialog.Title>Remove client</Dialog.Title>

				<div className="text-muted-foreground">
					<p>Are you sure you want to remove this client?</p>
					<p>This action cannot be undone.</p>
				</div>

				<Dialog.Footer>
					<Dialog.Close asChild>
						<Button variant="outline" size="sm">
							Cancel
						</Button>
					</Dialog.Close>

					<Button
						variant="destructive"
						size="sm"
						className="w-[100px]"
						onClick={() => removeClientMutation()}
						disabled={isPending || isSuccess}
					>
						{isPending || isSuccess ? (
							<Loader2Icon className="size-4 animate-spin" />
						) : (
							"Remove"
						)}
					</Button>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
	);
};
