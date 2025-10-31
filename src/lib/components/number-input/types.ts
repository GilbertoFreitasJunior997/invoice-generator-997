import type { BaseInputProps } from "../base-field/types";

export type NumberInputProps = BaseInputProps<number | undefined> & {
	thousandSeparator?: string;
	decimalSeparator?: string;
	allowNegative?: boolean;
	placeholder?: string;
	min?: number;
	max?: number;
	suffix?: string;
	prefix?: string;
	fixedDecimalScale?: boolean;
	decimalScale?: number;
};
