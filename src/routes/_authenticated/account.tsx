import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/account")({
	component: RouteComponent,
	loader: async ({ context }) => {
		return {
			user: context.user,
		};
	},
});

function RouteComponent() {
	const { user } = Route.useLoaderData();

	return (
		<div>
			<h1>authenticated</h1>

			<button type="button">
				<Link to="/logout">sign out</Link>
			</button>

			<p>{JSON.stringify(user)}</p>
		</div>
	);
}
