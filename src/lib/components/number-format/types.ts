import type { NumericFormatProps } from "react-number-format";

export type NumberFormatProps = Omit<
	NumericFormatProps,
	"value" | "onValueChange"
> & {
	stepper?: number;
	thousandSeparator?: string;
	placeholder?: string;
	defaultValue?: number;
	min?: number;
	max?: number;
	value?: number; // Controlled value
	suffix?: string;
	prefix?: string;
	onValueChange?: (value: number | undefined) => void;
	fixedDecimalScale?: boolean;
	decimalScale?: number;
};
