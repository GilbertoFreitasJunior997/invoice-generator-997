import { useFieldContext } from "@/lib/utils/forms.utils";
import { BaseInput } from "../base-input";
import { Combobox } from "../combobox";
import type { ComboboxBaseValue } from "../combobox/types";
import type { ComboboxInputProps } from "./types";

export const ComboboxInput = <TValue extends ComboboxBaseValue = string>({
	items,
	isLoading = false,
	comboboxProps,
	...props
}: ComboboxInputProps<TValue>) => {
	const { disabled } = props;

	const field = useFieldContext<TValue[]>();

	return (
		<BaseInput
			{...props}
			children={({ isInvalid }) => {
				return (
					<Combobox
						items={items}
						isLoading={isLoading}
						value={field.state.value}
						onValueChange={(value) => field.handleChange(value)}
						{...comboboxProps}
						triggerProps={{
							id: field.name,
							name: field.name,
							onBlur: field.handleBlur,
							"aria-invalid": isInvalid,
							"aria-disabled": disabled,
							disabled,
							...comboboxProps?.triggerProps,
						}}
					/>
				);
			}}
		/>
	);
};
