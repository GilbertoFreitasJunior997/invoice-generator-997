import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/account")({
	component: AccountRoute,
});

function AccountRoute() {
	return <div>Account</div>;
}
