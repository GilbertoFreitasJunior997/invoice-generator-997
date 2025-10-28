import { useFieldContext } from "@/lib/utils/forms.utils";
import { BaseInput } from "../base-input";
import { NumberFormat } from "../number-format";
import type { NumberInputProps } from "./types";

export const NumberInput = ({
	numberInputProps,
	...props
}: NumberInputProps) => {
	const { disabled } = props;

	const field = useFieldContext<number | undefined>();

	return (
		<BaseInput
			{...props}
			children={({ isInvalid }) => {
				return (
					<NumberFormat
						id={field.name}
						name={field.name}
						value={field.state.value ?? undefined}
						onBlur={field.handleBlur}
						onValueChange={(value) => field.handleChange(value ?? undefined)}
						aria-invalid={isInvalid}
						aria-disabled={disabled}
						disabled={disabled}
						{...numberInputProps}
					/>
				);
			}}
		/>
	);
};
