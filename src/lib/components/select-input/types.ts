import type { ReactNode } from "react";
import type { CommonInputProps } from "../base-input/types";
import type { SelectRootProps } from "../select/types";

export type SelectInputBaseValue = string | number;

export type SelectInputItem<TValue extends SelectInputBaseValue = string> = {
	label: ReactNode;
	value: TValue;
};

export type SelectInputProps<TValue extends SelectInputBaseValue = string> =
	CommonInputProps & {
		selectProps?: SelectRootProps;
		items?: SelectInputItem<TValue>[];
		isLoading?: boolean;
	};
