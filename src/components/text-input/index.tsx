import { useFieldContext } from "@/lib/utils/forms.utils";
import { BaseInput } from "../base-input";
import { Input } from "../input";
import type { TextInputProps } from "./types";

export const TextInput = ({ inputProps, ...props }: TextInputProps) => {
	const { disabled } = props;

	const field = useFieldContext<string>();

	return (
		<BaseInput
			{...props}
			children={({ isInvalid }) => {
				return (
					<Input
						id={field.name}
						name={field.name}
						value={field.state.value}
						onBlur={field.handleBlur}
						onChange={(e) => field.handleChange(e.target.value)}
						aria-invalid={isInvalid}
						aria-disabled={disabled}
						disabled={disabled}
						{...inputProps}
					/>
				);
			}}
		/>
	);
};
