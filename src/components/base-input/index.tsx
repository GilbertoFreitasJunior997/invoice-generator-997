import { Field } from "../field";
import type { BaseInputProps } from "./types";

export const BaseInput = ({ field, label, children }: BaseInputProps) => {
	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

	return (
		<Field.Root data-invalid={isInvalid}>
			<Field.Label htmlFor={field.name}>{label}</Field.Label>

			{children({ isInvalid })}

			{isInvalid && <Field.Error errors={field.state.meta.errors} />}
		</Field.Root>
	);
};
