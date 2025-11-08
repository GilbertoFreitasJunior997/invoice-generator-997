import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { AppSidebar } from "@/lib/components/app-sidebar";
import { Sidebar } from "@/lib/components/sidebar";
import { getCurrentUserQueryOptions } from "@/lib/query-options/user.query-options";
import { cn } from "@/lib/utils/cn";
import { Route as InvoicesNewRoute } from "./invoices/new";

const routesWithoutPadding = [InvoicesNewRoute.to];

export const Route = createFileRoute("/_app")({
	beforeLoad: async ({ location, context }) => {
		const user = await context.queryClient.fetchQuery(
			getCurrentUserQueryOptions(location.pathname),
		);

		return { user };
	},
	loader: async ({ context }) => {
		return { user: context.user };
	},
	component: AuthenticatedRouteLayout,
});

function AuthenticatedRouteLayout() {
	const location = useLocation();

	const isRouteWithoutPadding = routesWithoutPadding.some((route) =>
		location.pathname.replaceAll("/", "").startsWith(route.replaceAll("/", "")),
	);

	return (
		<Sidebar.Provider>
			<AppSidebar />

			<main
				className={cn(
					"grow h-full background-gradient overflow-x-hidden overflow-y-auto",
					isRouteWithoutPadding ? "" : "p-8",
				)}
			>
				<Outlet />
			</main>
		</Sidebar.Provider>
	);
}
