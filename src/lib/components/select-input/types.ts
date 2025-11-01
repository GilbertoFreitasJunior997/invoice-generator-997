import type { ReactNode } from "react";
import type { BaseInputProps } from "../base-field/types";

export type SelectInputItem = {
	value: string;
	label: ReactNode;
};

export type SelectInputCommonProps = {
	items?: SelectInputItem[];
	isItemsLoading?: boolean;
};

export type SelectInputProps = BaseInputProps<string | undefined> &
	SelectInputCommonProps;
