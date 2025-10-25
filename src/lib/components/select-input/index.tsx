import { useFieldContext } from "@/lib/utils/forms.utils";
import { BaseInput } from "../base-input";
import { Select } from "../select";
import type { SelectInputBaseValue, SelectInputProps } from "./types";

export const SelectInput = <TValue extends SelectInputBaseValue = string>({
	selectProps,
	items,
	isLoading = false,
	...props
}: SelectInputProps<TValue>) => {
	const { disabled } = props;

	const field = useFieldContext<TValue | undefined>();

	const selectedItem = items?.find((item) => item.value === field.state.value);

	return (
		<BaseInput
			{...props}
			children={({ isInvalid }) => {
				return (
					<Select.Root
						{...selectProps}
						aria-invalid={isInvalid}
						aria-disabled={disabled}
						disabled={disabled}
						value={String(field.state.value)}
						onValueChange={(baseValue) => {
							if (!baseValue || !items?.length) {
								field.handleChange(undefined);
								return;
							}

							const isNumber = typeof items[0].value === "number";
							const newValue = (
								isNumber ? Number(baseValue) : baseValue
							) as TValue;

							field.handleChange(newValue);
						}}
					>
						<Select.Trigger disabled={disabled} aria-disabled={disabled}>
							<Select.Value>{selectedItem?.label}</Select.Value>
						</Select.Trigger>

						<Select.Content>
							{isLoading ? (
								<div className="p-1.5 text-sm text-muted-foreground text-center">
									Loading...
								</div>
							) : !!items && items.length > 0 ? (
								items.map((item) => (
									<Select.Item
										key={String(item.value)}
										value={String(item.value)}
									>
										{item.label}
									</Select.Item>
								))
							) : (
								<div className="p-1.5 text-sm text-muted-foreground text-center">
									No items found.
								</div>
							)}
						</Select.Content>
					</Select.Root>
				);
			}}
		/>
	);
};
