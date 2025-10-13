import { useMutation } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import type { User } from "@workos-inc/node";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { Form } from "@/components/form";
import { Logo } from "@/components/logo";
import { getAuth } from "@/lib/authkit/serverFunctions";
import {
	type UserSetupAccountForm,
	userSetupAccountFormSchema,
} from "@/lib/schemas/user.schemas";
import { getAuthUser, setupUserAccount } from "@/lib/services/user.service";
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
	const navigate = Route.useNavigate();

	const { mutateAsync: setupUserAccountMutation } = useMutation({
		mutationFn: async (data: UserSetupAccountForm) => {
			await setupUserAccount({
				data: {
					...data,
					email: authUser.email,
					workOsId: authUser.id,
				},
			});
		},
		onSuccess: () => {
			navigate({ to: "/account" });
		},
	});

	const form = useAppForm({
		defaultValues: {
			name: `${authUser.firstName} ${authUser.lastName}`,
			email: authUser.email,
			addressLine1: "",
			addressLine2: "",
			city: "",
			state: "",
			country: "",
		},
		onSubmit: async ({ value }) => {
			await setupUserAccountMutation(value);
		},
		validators: {
			onChange: userSetupAccountFormSchema,
		},
	});

	return (
		<div className="h-full bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
			<div className="w-full max-w-xl">
				<div className="mb-8 text-center space-y-4">
					<Logo />

					<h1 className="text-4xl font-bold text-foreground text-balance tracking-tight">
						Complete Your Account Setup
					</h1>
					<p className="text-muted-foreground text-base leading-relaxed max-w-md mx-auto">
						We need your business details to generate professional invoices for
						you.
					</p>
				</div>

				<Card.Root className="p-8 shadow-lg border-2">
					<Form.Root form={form}>
						<Form.Group>
							<form.AppField
								name="name"
								children={(field) => <field.TextInput label="Name" />}
							/>

							<form.AppField
								name="email"
								children={(field) => (
									<field.TextInput
										label="Email"
										description="Your email is linked to the account you are using to login"
										disabled
									/>
								)}
							/>

							<Form.Group className="grid grid-cols-3">
								<form.AppField
									name="addressLine1"
									children={(field) => (
										<field.TextInput
											label="Address line 1"
											description="e.g. 123 Main Street"
											fieldRootProps={{
												className: "col-span-2",
											}}
										/>
									)}
								/>

								<form.AppField
									name="addressLine2"
									children={(field) => (
										<field.TextInput
											label="Address line 2"
											description="e.g. Apt 123"
										/>
									)}
								/>
							</Form.Group>

							<form.AppField
								name="country"
								children={(field) => <field.TextInput label="Country" />}
							/>
							<form.AppField
								name="state"
								children={(field) => <field.TextInput label="State" />}
							/>
							<form.AppField
								name="city"
								children={(field) => <field.TextInput label="City" />}
							/>

							<form.SubmitButton label="Let's go!" className="w-full py-5" />
						</Form.Group>
					</Form.Root>
				</Card.Root>

				<div className="mt-6 text-center space-y-3">
					<Button
						type="button"
						variant="link"
						className="text-sm text-muted-foreground hover:text-foreground"
						asChild
					>
						<Route.Link to="/logout">Use another account</Route.Link>
					</Button>

					<p className="text-xs text-muted-foreground">
						Your information is secure and will never be shared
					</p>
				</div>
			</div>
		</div>
	);
}
