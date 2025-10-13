import type { ReactNode } from "react";

export type CommonInputProps = {
	label?: ReactNode;
};

export type BaseInputChildrenProps = {
	isInvalid: boolean;
};

export type BaseInputProps = CommonInputProps & {
	children: (props: BaseInputChildrenProps) => ReactNode;
};
