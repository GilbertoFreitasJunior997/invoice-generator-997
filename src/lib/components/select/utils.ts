import type { SelectInputItem } from "../select-input/types";

export const createSelectOptions = <T extends string>(options: T[]) => {
	return options.map((option) => ({
		value: option,
		label: option.charAt(0).toUpperCase() + option.slice(1),
	})) satisfies SelectInputItem<T>[];
};
