import { useFieldContext } from "@/lib/utils/forms.utils";
import { Field } from "../field";
import type { BaseInputProps } from "./types";

export const BaseInput = ({ label, children }: BaseInputProps) => {
	const field = useFieldContext();

	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

	return (
		<Field.Root data-invalid={isInvalid}>
			<Field.Label htmlFor={field.name}>{label}</Field.Label>

			{children({ isInvalid })}

			{isInvalid && <Field.Error errors={field.state.meta.errors} />}
		</Field.Root>
	);
};
