import { createFileRoute, redirect } from "@tanstack/react-router";
import { signOut } from "@/lib/authkit/serverFunctions";

export const Route = createFileRoute("/_guest/logout")({
	preload: false,
	loader: async ({ context: { queryClient } }) => {
		queryClient.clear();

		await signOut();

		throw redirect({ to: "/" });
	},
});
