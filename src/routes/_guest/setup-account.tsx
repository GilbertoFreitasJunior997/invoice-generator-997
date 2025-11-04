import { useMutation } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import type { User } from "@workos-inc/node";
import { ZapIcon } from "lucide-react";
import { useState } from "react";
import { getAuth } from "@/lib/authkit/serverFunctions";
import { AddressForm } from "@/lib/components/address-form";
import { Badge } from "@/lib/components/badge";
import { Button } from "@/lib/components/button";
import { Card } from "@/lib/components/card";
import { Logo } from "@/lib/components/logo";
import { LogoInput } from "@/lib/components/logo-input";
import type { LogoInputValue } from "@/lib/components/logo-input/types";
import { uploadLogoToStorage } from "@/lib/components/logo-input/utils";
import {
	type UserSelect,
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

		try {
			await getAuthUser({
				data: auth.user,
			});

			throw redirect({ to: "/dashboard" });
		} catch {
			return;
		}
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

	const [logoValue, setLogoValue] = useState<LogoInputValue>();
	const [isLogoLoading, setIsLogoLoading] = useState(false);

	const { mutateAsync: setupUserAccountMutation } = useMutation({
		mutationFn: async (
			data: UserSetupAccountForm & Pick<UserSelect, "logoKey">,
		) => {
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
			name: "",
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
		onSubmit: async ({ value }) => {
			const logoKey = (await uploadLogoToStorage(logoValue?.file)) ?? null;

			await setupUserAccountMutation({
				...value,
				logoKey,
			});
		},
	});

	return (
		<div className="min-h-screen flex items-center justify-center p-4 lg:p-8">
			<div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
				<div className="space-y-3">
					<Logo />

					<h1 className="text-4xl lg:text-5xl font-bold leading-tight">
						Streamline your business operations
					</h1>

					<div className="flex gap-2">
						<Badge isGhost={true}>
							<ZapIcon />
							Track your expenses and income
						</Badge>

						<Badge isGhost={true}>
							<ZapIcon />
							Generate invoices
						</Badge>
					</div>

					<p className="text-base lg:text-lg text-muted-foreground leading-relaxed max-w-lg">
						Complete your account setup and start managing your business with
						our streamlined platform.
					</p>
				</div>

				<div className="w-full">
					<Card.Root className="p-8 shadow-lg rounded-lg">
						<div className="space-y-6">
							<div className="space-y-2">
								<h2 className="text-2xl font-bold">
									Complete your account setup
								</h2>
								<p className="text-sm text-muted-foreground">
									Help us understand your business better
								</p>
							</div>

							<form.Root form={form}>
								<form.Group className="space-y-4">
									<form.Group className="grid grid-cols-[auto_1fr] gap-2">
										<LogoInput
											onChange={setLogoValue}
											isLoading={isLogoLoading}
											setIsLoading={setIsLogoLoading}
										/>

										<form.Group className="justify-between">
											<form.AppField
												name="name"
												children={(field) => (
													<field.TextInput
														label="Name"
														placeholder="Acme Inc."
														description="Use your business name"
													/>
												)}
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
									</form.Group>

									<AddressForm form={form} />

									<form.SubmitButton
										className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg"
										disabled={isLogoLoading}
									>
										Let's go!
									</form.SubmitButton>
								</form.Group>
							</form.Root>

							<div className="space-y-4 pt-4">
								<Button
									type="button"
									variant="link"
									className="text-sm text-muted-foreground hover:text-foreground w-full"
									asChild
								>
									<Route.Link to="/logout">Use another account</Route.Link>
								</Button>

								<p className="text-xs text-muted-foreground text-center">
									Your information is secure and will never be shared
								</p>
							</div>
						</div>
					</Card.Root>
				</div>
			</div>
		</div>
	);
}
