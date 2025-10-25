import { createFileRoute } from "@tanstack/react-router";
import { signOut } from "@/lib/authkit/serverFunctions";
import { getCurrentUserQueryKeys } from "./_authenticated/route";

export const Route = createFileRoute("/logout")({
	preload: false,
	loader: async ({ context: { queryClient } }) => {
		await queryClient.invalidateQueries({
			queryKey: getCurrentUserQueryKeys,
			exact: false,
		});

		await signOut();
	},
});
