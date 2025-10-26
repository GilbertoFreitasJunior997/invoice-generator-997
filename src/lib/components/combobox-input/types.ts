import type { CommonInputProps } from "../base-input/types";
import type {
	ComboboxBaseValue,
	ComboboxItem,
	ComboboxProps,
} from "../combobox/types";

export type ComboboxInputProps<TValue extends ComboboxBaseValue = string> =
	CommonInputProps & {
		items?: ComboboxItem<TValue>[];
		isLoading?: boolean;
		comboboxProps?: Omit<
			ComboboxProps<TValue>,
			"items" | "value" | "onValueChange"
		>;
	};
