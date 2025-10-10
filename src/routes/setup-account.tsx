import { createFileRoute, redirect } from "@tanstack/react-router";
import { getAuth } from "@/lib/authkit/serverFunctions";
import { getAuthUser } from "@/lib/services/user.service";

export const Route = createFileRoute("/setup-account")({
	component: AccountSetup,
	beforeLoad: async () => {
		const auth = await getAuth();
		if (!auth.user) {
			throw redirect({ to: "/" });
		}

		const user = await getAuthUser({
			data: auth.user,
		});
		if (!user) {
			return;
		}

		redirect({ to: "/account" });
	},
});

function AccountSetup() {
	return <div>Setup account</div>;
}
