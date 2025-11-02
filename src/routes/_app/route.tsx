import { queryOptions } from "@tanstack/react-query";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getAuth, getSignInUrl } from "@/lib/authkit/serverFunctions";
import { AppSidebar } from "@/lib/components/app-sidebar";
import { Sidebar } from "@/lib/components/sidebar";
import { getAuthUser } from "@/lib/services/user.service";

export const getCurrentUserQueryKeys = ["current-user"] as const;

const getCurrentUser = createServerFn()
	.inputValidator((d: { pathname: string }) => d)
	.handler(async ({ data: { pathname } }) => {
		const auth = await getAuth();
		if (!auth.user) {
			const href = await getSignInUrl({ data: pathname });
			throw redirect({ href });
		}

		const result = await getAuthUser({
			data: auth.user,
		});

		if (!result?.success) {
			throw redirect({ to: "/setup-account" });
		}

		return result.data;
	});

const getCurrentUserQueryOptions = (pathname: string) =>
	queryOptions({
		queryKey: getCurrentUserQueryKeys,
		queryFn: () => getCurrentUser({ data: { pathname } }),
	});

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
	return (
		<Sidebar.Provider>
			<AppSidebar />

			<div className="grow h-full p-3 grid grid-cols-[auto_1fr] background-gradient">
				<Sidebar.Trigger />

				<main className="pt-1 pl-2 overflow-x-hidden overflow-y-auto">
					<Outlet />
				</main>
			</div>
		</Sidebar.Provider>
	);
}
