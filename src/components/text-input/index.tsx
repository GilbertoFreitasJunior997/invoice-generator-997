import { useFieldContext } from "@/lib/utils/forms.utils";
import { BaseInput } from "../base-input";
import { Input } from "../input";
import type { TextInputProps } from "./types";

export const TextInput = ({ label, inputProps }: TextInputProps) => {
	const field = useFieldContext<string>();

	return (
		<BaseInput
			label={label}
			children={({ isInvalid }) => {
				return (
					<Input
						id={field.name}
						name={field.name}
						value={field.state.value}
						onBlur={field.handleBlur}
						onChange={(e) => field.handleChange(e.target.value)}
						aria-invalid={isInvalid}
						{...inputProps}
					/>
				);
			}}
		/>
	);
};
