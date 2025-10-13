import type { CommonInputProps } from "../base-input/types";
import type { InputProps } from "../input/types";

export type TextInputProps = CommonInputProps & {
	inputProps?: InputProps;
};
