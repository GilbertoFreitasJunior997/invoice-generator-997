import type { AnyFieldApi } from "@tanstack/react-form";
import type { ReactNode } from "react";

export type CommonInputProps = {
	field: AnyFieldApi;
	label?: ReactNode;
};

export type BaseInputChildrenProps = {
	isInvalid: boolean;
};

export type BaseInputProps = CommonInputProps & {
	children: (props: BaseInputChildrenProps) => ReactNode;
};
