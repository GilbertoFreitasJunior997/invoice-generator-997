import type { CommonInputProps } from "../base-input/types";
import type { NumberFormatProps } from "../number-format/types";

export type NumberInputProps = CommonInputProps & {
	numberInputProps?: NumberFormatProps;
};
