import type { BaseInputProps } from "../base-field/types";
import type { SelectInputCommonProps } from "../select-input/types";

export type SelectMultipleInputProps = BaseInputProps<string[]> &
	SelectInputCommonProps;
