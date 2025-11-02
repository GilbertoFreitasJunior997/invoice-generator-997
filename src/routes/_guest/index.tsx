import { createFileRoute, redirect } from "@tanstack/react-router";
import { getAuth, getSignInUrl } from "@/lib/authkit/serverFunctions";
import { Button } from "@/lib/components/button";

export const Route = createFileRoute("/_guest/")({
	component: App,
	beforeLoad: async () => {
		const auth = await getAuth();
		if (auth.user) {
			throw redirect({ to: "/dashboard" });
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
		<div className="flex flex-col items-center justify-center h-screen background-gradient">
			<Button asChild>
				<a href={signInUrl}> Sign in </a>
			</Button>
		</div>
	);
}
