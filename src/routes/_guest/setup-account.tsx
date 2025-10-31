import { useMutation } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import type { User } from "@workos-inc/node";
import { getAuth } from "@/lib/authkit/serverFunctions";
import { AddressForm } from "@/lib/components/address-form";
import { Button } from "@/lib/components/button";
import { Card } from "@/lib/components/card";
import { Logo } from "@/lib/components/logo";
import {
	type UserSetupAccountForm,
	userSetupAccountFormSchema,
} from "@/lib/schemas/user.schemas";
import { getAuthUser, setupUserAccount } from "@/lib/services/user.service";
import { defaultCountry } from "@/lib/utils/address.utils";
import { useAppForm } from "@/lib/utils/forms.utils";

export const Route = createFileRoute("/_guest/setup-account")({
	component: SetupAccountPage,
	beforeLoad: async () => {
		const auth = await getAuth();
		if (!auth.user) {
			throw redirect({ to: "/" });
		}

		const result = await getAuthUser({
			data: auth.user,
		});
		if (!result?.success) {
			return;
		}

		redirect({ to: "/dashboard" });
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
					avatarUrl: authUser.profilePictureUrl ?? "",
				},
			});
		},
		onSuccess: () => {
			navigate({ to: "/dashboard" });
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
			country: defaultCountry,
			zip: "",
			taxId: "",
		},
		validators: {
			onChange: userSetupAccountFormSchema,
		},
		onSubmit: ({ value }) => setupUserAccountMutation(value),
	});

	return (
		<div className="h-screen bg-linear-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
			<div className="w-full max-w-2xl">
				<div className="mb-8 text-center space-y-4">
					<div className="w-full flex items-center justify-center">
						<Logo size="lg" />
					</div>

					<h1 className="text-3xl font-bold text-foreground text-balance tracking-tight">
						Complete Your Account Setup
					</h1>
					<p className="text-muted-foreground text-base leading-relaxed max-w-md mx-auto">
						We need your business details to generate professional invoices for
						you.
					</p>
				</div>

				<Card.Root className="p-8 shadow-lg border-2">
					<form.Root form={form}>
						<form.Group>
							<form.Group className="grid grid-cols-2">
								<form.AppField
									name="name"
									children={(field) => <field.TextInput label="Name" />}
								/>

								<form.AppField
									name="email"
									children={(field) => (
										<field.TextInput
											label="Email"
											description="Linked account you are using to login"
											isDisabled={true}
										/>
									)}
								/>
							</form.Group>

							<AddressForm form={form} />

							<form.SubmitButton className="w-full py-5">
								Let's go!
							</form.SubmitButton>
						</form.Group>
					</form.Root>
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
