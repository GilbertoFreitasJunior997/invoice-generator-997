import { createFileRoute, redirect } from "@tanstack/react-router";
import type { User } from "@workos-inc/node";
import { Card } from "@/components/card";
import { getAuth } from "@/lib/authkit/serverFunctions";
import { userSetupAccountFormSchema } from "@/lib/schemas/user.schemas";
import { getAuthUser } from "@/lib/services/user.service";
import { useAppForm } from "@/lib/utils/forms.utils";

export const Route = createFileRoute("/setup-account")({
	component: SetupAccountPage,
	beforeLoad: async () => {
		const auth = await getAuth();
		if (!auth.user) {
			throw redirect({ to: "/" });
		}

		const user = await getAuthUser({
			data: auth.user,
		});
		if (!user) {
			return;
		}

		redirect({ to: "/account" });
	},
	loader: async () => {
		const auth = await getAuth();

		// auth will be defined because of the beforeLoad check
		return { authUser: auth.user as User };
	},
});

export default function SetupAccountPage() {
	const { authUser } = Route.useLoaderData();
	const form = useAppForm({
		defaultValues: {
			name: `${authUser.firstName} ${authUser.lastName}`,
			addressLine1: "",
			addressLine2: "",
		},
		onSubmit: ({ value }) => {
			console.log(value);
		},
		validators: {
			onChange: userSetupAccountFormSchema,
		},
	});

	return (
		<div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
			<div className="w-full max-w-xl">
				<div className="mb-8 text-center space-y-3">
					<h1 className="text-5xl font-bold text-foreground text-balance tracking-tight">
						Welcome aboard {authUser.firstName}! 👋
					</h1>
					<p className="text-muted-foreground text-lg leading-relaxed max-w-md mx-auto">
						Let's get you set up in just a moment. We only need a few details to
						get started.
					</p>
				</div>

				<Card.Root className="p-8 shadow-lg border-2">
					<form.AppForm>
						<form className="space-y-6">
							<div className="space-y-2">
								<form.AppField
									name="name"
									children={(field) => <field.TextInput label="Name" />}
								/>
							</div>

							<div className="space-y-2">
								<form.AppField
									name="addressLine1"
									children={(field) => (
										<field.TextInput label="Address Line 1" />
									)}
								/>
							</div>

							<div className="space-y-2">
								<form.AppField
									name="addressLine2"
									children={(field) => (
										<field.TextInput label="Address Line 2" />
									)}
								/>
							</div>

							<form.SubmitButton label="Let's go! 🚀" className="w-full py-5" />
						</form>
					</form.AppForm>
				</Card.Root>

				<div className="mt-6 text-center">
					<p className="text-sm text-muted-foreground">
						Your information is secure and will never be shared
					</p>
				</div>
			</div>
		</div>
	);
}
