import type { PropsWithChildren, ReactNode } from "react";

export type FieldRootProps = PropsWithChildren & {
	className?: string;
};

export type FieldLabelProps = {
	htmlFor: string;
	label?: ReactNode;
	isRequired?: boolean;
	className?: string;
};

export type FieldErrorProps = {
	errors?: string[];
	className?: string;
};

export type FieldDescriptionProps = {
	description?: ReactNode;
	className?: string;
};
