import { useStore } from "@tanstack/react-form";
import { countriesSelectOptions } from "@/lib/schemas/countries.schemas";
import {
	defaultCountry,
	getCountryAddressLine1Placeholder,
	getCountryAddressLine2Placeholder,
	getCountryCityPlaceholder,
	getCountryStatePlaceholder,
	getCountryTaxIdPlaceholder,
	getCountryZipPlaceholder,
} from "@/lib/utils/address.utils";
import { withForm } from "@/lib/utils/forms.utils";

type AddressFormProps = {
	layout?: "default" | "stacked";
};

export const AddressForm = withForm({
	// biome-ignore lint/suspicious/noExplicitAny: needs any to support any form
	defaultValues: {} as any,
	props: {} as AddressFormProps,
	render: function Render({ form, layout = "default" }) {
		const selectedCountry =
			useStore(form.store, (s) => s.values.country) ?? defaultCountry;

		return (
			<form.Group>
				<form.AppField
					name="country"
					children={(field) => (
						<field.SelectInput label="Country" items={countriesSelectOptions} />
					)}
				/>

				<form.Group className="grid grid-cols-3">
					<form.AppField
						name="addressLine1"
						children={(field) => (
							<field.TextInput
								label="Address line 1"
								placeholder={getCountryAddressLine1Placeholder(selectedCountry)}
								rootClassName="col-span-2"
							/>
						)}
					/>

					<form.AppField
						name="addressLine2"
						children={(field) => (
							<field.TextInput
								label="Address line 2"
								placeholder={getCountryAddressLine2Placeholder(selectedCountry)}
							/>
						)}
					/>
				</form.Group>

				<form.Group className="grid grid-cols-6">
					<form.AppField
						name="city"
						children={(field) => (
							<field.TextInput
								label="City"
								placeholder={getCountryCityPlaceholder(selectedCountry)}
								rootClassName={
									layout === "default" ? "col-span-2" : "col-span-4"
								}
							/>
						)}
					/>

					<form.AppField
						name="state"
						children={(field) => (
							<field.TextInput
								label="State"
								placeholder={getCountryStatePlaceholder(selectedCountry)}
								rootClassName={
									layout === "default" ? "col-span-2" : "col-span-2"
								}
							/>
						)}
					/>

					<form.AppField
						name="zip"
						children={(field) => (
							<field.TextInput
								label="Zip"
								placeholder={getCountryZipPlaceholder(selectedCountry)}
								rootClassName={
									layout === "default" ? "col-span-2" : "col-span-6"
								}
							/>
						)}
					/>
				</form.Group>

				<form.AppField
					name="taxId"
					children={(field) => (
						<field.TextInput
							label="Tax ID"
							placeholder={getCountryTaxIdPlaceholder(selectedCountry)}
							description="If provided, it will be displayed on the invoices"
						/>
					)}
				/>
			</form.Group>
		);
	},
});
