import { useInputProps } from "../base-field/utils";
import { Field } from "../field";
import { Select } from "../select";
import type { SelectInputProps } from "./types";

export const SelectInput = (props: SelectInputProps) => {
	const {
		id,
		errors,
		label,
		inputProps,
		description,
		isRequired,
		value,
		onChange,
		placeholder,
		rootClassName,
		items,
		isItemsLoading,
		isLoading,
	} = useInputProps(props);

	const selectedItem = items?.find((item) => item.value === value);

	const handleChange = (newValue: string) => {
		console.log("newValue", newValue);

		if (!newValue || !items?.length) {
			onChange?.(undefined);
			return;
		}

		onChange?.(newValue);
	};

	return (
		<Field.Root className={rootClassName}>
			<Field.Label htmlFor={id} label={label} isRequired={isRequired} />

			<Select.Root
				value={value ?? ""}
				disabled={inputProps.disabled}
				onValueChange={handleChange}
			>
				<Field.LoadingContainer isLoading={isLoading}>
					<Select.Trigger {...inputProps}>
						<Select.Value placeholder={placeholder}>
							<span>{selectedItem?.label}</span>
						</Select.Value>
					</Select.Trigger>
				</Field.LoadingContainer>

				<Select.Content>
					{isItemsLoading ? (
						<div className="p-1.5 text-sm text-muted-foreground text-center">
							Loading...
						</div>
					) : !!items && items.length > 0 ? (
						items.map((item) => (
							<Select.Item key={item.value} value={item.value}>
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

			<Field.Description description={description} />

			<Field.Error errors={errors} />
		</Field.Root>
	);
};
