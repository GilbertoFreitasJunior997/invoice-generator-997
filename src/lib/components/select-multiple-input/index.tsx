import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/lib/components/button";
import { Command } from "@/lib/components/command";
import { Popover } from "@/lib/components/popover";
import { cn } from "@/lib/utils/cn";
import { useInputProps } from "../base-field/utils";
import { Field } from "../field";
import { inputBoxClassNames } from "../field/consts";
import type { SelectMultipleInputProps } from "./types";

export const SelectMultipleInput = (props: SelectMultipleInputProps) => {
	const {
		id,
		errors,
		label,
		inputProps,
		description,
		isRequired,
		value,
		onChange,
		onBlur,
		items,
		isItemsLoading,
		isLoading,
		placeholder = "Select an option",
		rootClassName,
	} = useInputProps(props);

	const [open, setOpen] = useState(false);

	const hasValue = !!value && value.length > 0;
	const valueDisplay = items
		?.filter((item) => value?.includes(item.value))
		.map((item) => item.label)
		.join(", ");

	const handleValueChange = (selectedItem: string) => {
		const hasValue = value?.some((value) => value === selectedItem);
		let updatedValue = value;

		if (hasValue) {
			updatedValue = updatedValue?.filter((value) => value !== selectedItem);
		} else {
			updatedValue = [...(updatedValue ?? []), selectedItem];
		}

		onChange?.(updatedValue ?? []);
	};

	return (
		<Field.Root className={rootClassName}>
			<Field.Label htmlFor={id} label={label} isRequired={isRequired} />

			<Popover.Root open={open} onOpenChange={setOpen}>
				<Field.LoadingContainer isLoading={isLoading}>
					<Popover.Trigger asChild>
						<Button
							variant="outline"
							role="combobox"
							aria-expanded={open}
							className={cn(inputBoxClassNames, "justify-between")}
							onBlur={onBlur}
							{...inputProps}
						>
							{hasValue ? (
								valueDisplay
							) : (
								<span className="text-muted-foreground">{placeholder}</span>
							)}

							<ChevronsUpDown className="opacity-50" />
						</Button>
					</Popover.Trigger>
				</Field.LoadingContainer>

				<Popover.Content className="max-w-[500px] w-(--radix-popover-trigger-width) p-0">
					<Command.Root>
						<Command.Input placeholder="Search..." className="h-9" />

						<Command.List>
							<Command.Empty>No items found.</Command.Empty>

							<Command.Group>
								{isItemsLoading ? (
									<div className="p-1.5 text-sm text-muted-foreground text-center">
										Loading...
									</div>
								) : (
									!!items?.length &&
									items.map((item) => {
										const isSelected = value?.some(
											(value) => value === item.value,
										);

										return (
											<Command.Item
												key={item.value}
												value={String(item.value)}
												onSelect={() => handleValueChange(item.value)}
											>
												{item.label}
												<Check
													className={cn(
														"ml-auto",
														isSelected ? "opacity-100" : "opacity-0",
													)}
												/>
											</Command.Item>
										);
									})
								)}
							</Command.Group>
						</Command.List>
					</Command.Root>
				</Popover.Content>
			</Popover.Root>

			<Field.Description description={description} />

			<Field.Error errors={errors} />
		</Field.Root>
	);
};
