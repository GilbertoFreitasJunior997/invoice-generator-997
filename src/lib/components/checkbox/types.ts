import type { OmitKeyof } from "@tanstack/react-query";
import type { BaseInputProps } from "../base-field/types";

export type CheckboxProps = OmitKeyof<
	BaseInputProps<boolean>,
	"placeholder"
> & {
	className?: string;
};
