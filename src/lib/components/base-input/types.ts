import type { ReactNode } from "react";
import type {
	FieldDescriptionProps,
	FieldErrorProps,
	FieldLabelProps,
	FieldRootProps,
} from "../field/types";

export type CommonInputProps = {
	label?: ReactNode;
	description?: ReactNode;
	disabled?: boolean;

	fieldRootProps?: FieldRootProps;
	fieldLabelProps?: FieldLabelProps;
	fieldDescriptionProps?: FieldDescriptionProps;
	fieldErrorProps?: FieldErrorProps;
};

export type BaseInputChildrenProps = {
	isInvalid: boolean;
	isRequired: boolean;
};

export type BaseInputProps = CommonInputProps & {
	children: (props: BaseInputChildrenProps) => ReactNode;
};
