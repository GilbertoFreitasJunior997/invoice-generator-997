import type { ReactNode } from "react";
import type { ButtonProps } from "../button/types";

export type ComboboxBaseValue = string | number;

export type ComboboxItem<TValue extends ComboboxBaseValue = string> = {
	label: ReactNode;
	value: TValue;
};

export type ComboboxProps<TValue extends ComboboxBaseValue = string> = {
	items?: ComboboxItem<TValue>[];
	isLoading?: boolean;
	placeholder?: string;
	value: TValue[];
	onValueChange: (value: TValue[]) => void;

	triggerProps?: ButtonProps;
};
