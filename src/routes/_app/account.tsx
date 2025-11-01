import { mutationOptions, useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { Button } from "@/lib/components/button";
import { deleteLogoFromStorage } from "@/lib/components/logo-input/utils";
import { db } from "@/lib/db";
import { usersTable } from "@/lib/db/tables";
import {
	createServerErrorResponse,
	createServerSuccessResponse,
} from "@/lib/utils/server-fns.utils";

export const Route = createFileRoute("/_app/account")({
	component: AccountRoute,
	loader: async ({ context }) => ({ user: context.user }),
});

const deleteUserFn = createServerFn()
	.inputValidator((d: { userId: string }) => d)
	.handler(async ({ data }) => {
		try {
			await db.transaction(async (tx) => {
				const [deletedUser] = await tx
					.delete(usersTable)
					.where(eq(usersTable.id, data.userId))
					.returning();

				if (deletedUser?.logoKey) {
					await deleteLogoFromStorage(deletedUser.logoKey);
				}
			});

			return createServerSuccessResponse();
		} catch (error) {
			return createServerErrorResponse({ error });
		}
	});

const deleteUserMutationOptions = mutationOptions({
	mutationFn: (userId: string) => deleteUserFn({ data: { userId } }),
});

function AccountRoute() {
	const { user } = Route.useLoaderData();
	const navigate = Route.useNavigate();

	const { mutateAsync: deleteUserMutation, isPending } = useMutation({
		...deleteUserMutationOptions,
		onSuccess: () => {
			navigate({ to: "/logout" });
		},
	});

	return (
		<div>
			<h1>Account</h1>

			<Button onClick={() => deleteUserMutation(user.id)} disabled={isPending}>
				Delete Account
			</Button>
		</div>
	);
}
