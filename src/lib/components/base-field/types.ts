import type { ReactNode } from "react";

export type BaseInputProps<TValue = unknown> = {
	name?: string;
	label?: ReactNode;
	description?: ReactNode;
	placeholder?: string;

	isReadOnly?: boolean;
	isRequired?: boolean;
	isDisabled?: boolean;

	value?: TValue;
	onChange?: (value: TValue) => void;
	onBlur?: () => void;

	errors?: string[];
	showErrors?: boolean;

	rootClassName?: string;
};
