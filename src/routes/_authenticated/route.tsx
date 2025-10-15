import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getAuth, getSignInUrl } from "@/lib/authkit/serverFunctions";
import { AppSidebar } from "@/lib/components/app-sidebar";
import { Sidebar } from "@/lib/components/sidebar";
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
	loader: async ({ context }) => {
		return { user: context.user };
	},
	component: AuthenticatedRouteLayout,
});

function AuthenticatedRouteLayout() {
	return (
		<Sidebar.Provider>
			<AppSidebar />

			<div className="p-4 w-full">
				<Sidebar.Trigger />

				<main className="pl-1 pt-3 w-full">
					<Outlet />
				</main>
			</div>
		</Sidebar.Provider>
	);
}
