import { useId } from "react";
import type { BaseInputProps } from "./types";

// biome-ignore lint/suspicious/noExplicitAny: need to support any input value
export const useInputProps = <TProps extends BaseInputProps<any>>({
	errors: propsErrors,
	name,
	isDisabled,
	showErrors = true,
	label,
	isReadOnly,
	...props
}: TProps) => {
	const id = useId();

	const hasErrors = !!propsErrors?.length;
	const errors = hasErrors && showErrors ? propsErrors : undefined;

	const inputProps = {
		id,
		name,
		"data-slot": "input",
		"aria-invalid": !!errors?.length,
		"aria-disabled": !!isDisabled,
		"aria-readonly": !!isReadOnly,
		readOnly: !!isReadOnly,
		disabled: !!isDisabled,
	};

	return {
		id,
		isDisabled,
		isReadOnly,
		errors,
		label,
		inputProps,
		...props,
	};
};
