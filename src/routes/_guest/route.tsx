import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_guest")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<main>
			<Outlet />
		</main>
	);
}
