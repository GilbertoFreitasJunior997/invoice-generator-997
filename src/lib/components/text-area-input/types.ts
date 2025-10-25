import type { CommonInputProps } from "../base-input/types";
import type { TextAreaProps } from "../text-area/types";

export type TextAreaInputProps = CommonInputProps & {
	textAreaProps?: TextAreaProps;
};
