import type { ReactNode } from "react";
import type { BaseInputProps } from "../base-field/types";

export type SelectInputItem<T extends string> = {
	value: T;
	label: ReactNode;
};

export type SelectInputCommonProps<T extends string> = {
	items?: SelectInputItem<T>[];
	isItemsLoading?: boolean;
};

export type SelectInputProps<T extends string> = BaseInputProps<T | undefined> &
	SelectInputCommonProps<T>;
