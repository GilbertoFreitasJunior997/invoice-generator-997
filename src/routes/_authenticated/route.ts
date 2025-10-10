import { createFileRoute, redirect } from "@tanstack/react-router";
import { getAuth, getSignInUrl } from "@/lib/authkit/serverFunctions";
import { getAuthUser } from "@/lib/services/user.service";

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: async ({ location }) => {
		const auth = await getAuth();
		if (!auth.user) {
			const path = location.pathname;
			const href = await getSignInUrl({ data: path });
			throw redirect({ href });
		}

		const user = await getAuthUser({
			data: auth.user,
		});

		if (!user) {
			throw redirect({ to: "/setup-account" });
		}

		return { user };
	},
});
