import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/lib/components/button";
import { Command } from "@/lib/components/command";
import { Popover } from "@/lib/components/popover";
import { cn } from "@/lib/utils/cn";
import type { ComboboxBaseValue, ComboboxProps } from "./types";

export const Combobox = <TValue extends ComboboxBaseValue = string>({
	items,
	isLoading = false,
	placeholder = "Select an option",
	value,
	onValueChange,
	triggerProps,
}: ComboboxProps<TValue>) => {
	const [open, setOpen] = useState(false);

	const hasValue = !!value && value.length > 0;
	const valueDisplay = value?.join(", ") ?? "";

	const handleValueChange = (selectedItem: TValue) => {
		const hasValue = value.some((value) => value === selectedItem);
		let updatedValue = value;

		if (hasValue) {
			updatedValue = updatedValue.filter((value) => value !== selectedItem);
		} else {
			updatedValue = [...updatedValue, selectedItem];
		}

		onValueChange(updatedValue);
	};

	return (
		<Popover.Root open={open} onOpenChange={setOpen}>
			<Popover.Trigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					{...triggerProps}
					className={cn("w-[200px] justify-between", triggerProps?.className)}
				>
					{hasValue ? valueDisplay : placeholder}

					<ChevronsUpDown className="opacity-50" />
				</Button>
			</Popover.Trigger>

			<Popover.Content className="w-[200px] p-0">
				<Command.Root>
					<Command.Input placeholder="Search..." className="h-9" />

					<Command.List>
						<Command.Empty>No items found.</Command.Empty>

						<Command.Group>
							{isLoading ? (
								<div className="p-1.5 text-sm text-muted-foreground text-center">
									Loading...
								</div>
							) : items?.length ? (
								items.map((item) => {
									const isSelected = value.some(
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
							) : (
								<div className="p-1.5 text-sm text-muted-foreground text-center">
									No items found.
								</div>
							)}
						</Command.Group>
					</Command.List>
				</Command.Root>
			</Popover.Content>
		</Popover.Root>
	);
};
