import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useInputProps } from "../base-field/utils";
import { Field } from "../field";
import { inputBorderStateClassNames } from "../field/consts";
import type { CheckboxProps } from "./types";

const checkboxSizeClassNames = "size-5 min-h-5 max-h-5 min-w-5 max-w-5 p-0";

export const Checkbox = (props: CheckboxProps) => {
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
		isLoading,
		rootClassName,
		className,
	} = useInputProps(props);

	const handleCheckedChange = (checked: CheckboxPrimitive.CheckedState) => {
		const isChecked = checked === "indeterminate" ? false : !!checked;
		onChange?.(isChecked);
	};

	return (
		<Field.Root
			className={cn(
				rootClassName,
				"grid grid-cols-[auto_1fr] gap-2 items-center",
			)}
		>
			<Field.LoadingContainer
				isLoading={isLoading}
				className={checkboxSizeClassNames}
			>
				<CheckboxPrimitive.Root
					className={cn(
						inputBorderStateClassNames,
						"peer dark:bg-input/30 transition-shadow outline-none focus-visible:ring-[3px]",
						"data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary",
						"rounded-md",
						checkboxSizeClassNames,
						"disabled:cursor-not-allowed disabled:opacity-50",
						className,
					)}
					onBlur={onBlur}
					{...inputProps}
					checked={value ?? false}
					onCheckedChange={handleCheckedChange}
				>
					<CheckboxPrimitive.Indicator
						data-slot="checkbox-indicator"
						className="grid place-content-center text-current transition-none"
					>
						<CheckIcon className="size-4" />
					</CheckboxPrimitive.Indicator>
				</CheckboxPrimitive.Root>
			</Field.LoadingContainer>

			<Field.Label htmlFor={id} label={label} isRequired={isRequired} />

			<Field.Description description={description} className="col-span-2" />

			<Field.Error errors={errors} className="col-span-2" />
		</Field.Root>
	);
};
