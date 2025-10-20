import type { ReactNode } from "react";
import type { ButtonProps } from "../button/types";

export type SubmitButtonProps = {
	label?: ReactNode;
	className?: string;
	buttonProps?: ButtonProps;
	isDisabled?: boolean;
};
