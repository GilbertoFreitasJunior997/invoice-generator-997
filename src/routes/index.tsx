import { createFileRoute, redirect } from "@tanstack/react-router";
import { getAuth, getSignInUrl } from "@/lib/authkit/serverFunctions";

export const Route = createFileRoute("/")({
	component: App,
	beforeLoad: async () => {
		const auth = await getAuth();
		if (auth.user) {
			throw redirect({ to: "/account" });
		}
	},
	loader: async () => {
		const signInUrl = await getSignInUrl();
		return { signInUrl };
	},
});

function App() {
	const { signInUrl } = Route.useLoaderData();

	return (
		<div>
			<button type="button">
				<a href={signInUrl}> sign in</a>
			</button>
		</div>
	);
}
