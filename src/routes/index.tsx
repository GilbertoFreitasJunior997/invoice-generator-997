import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: IndexRoute,
});

function IndexRoute() {
	return <div>Hello from index!</div>;
}
