import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/lib/components/button";
import { Calendar } from "@/lib/components/calendar";
import { Popover } from "@/lib/components/popover";
import { cn } from "@/lib/utils/cn";
import { useInputProps } from "../base-field/utils";
import { Field } from "../field";
import { inputBoxClassNames } from "../field/consts";
import type { DateInputProps } from "./types";

export const DateInput = ({ ...props }: DateInputProps) => {
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
		placeholder,
		isLoading,
		rootClassName,
	} = useInputProps(props);

	const handleChange = (date?: Date) => {
		onChange?.(date);
	};

	const displayValue = value
		? format(value, "PPP")
		: placeholder || "Pick a date";

	return (
		<Field.Root className={rootClassName}>
			<Field.Label htmlFor={id} label={label} isRequired={isRequired} />

			<Popover.Root>
				<Field.LoadingContainer isLoading={isLoading}>
					<Popover.Trigger asChild>
						<Button
							variant="outline"
							data-empty={!value}
							className={cn(
								inputBoxClassNames,
								"data-[empty=true]:text-muted-foreground justify-start text-left font-normal",
							)}
							onBlur={onBlur}
							{...inputProps}
						>
							<CalendarIcon />
							<span>{displayValue}</span>
						</Button>
					</Popover.Trigger>
				</Field.LoadingContainer>

				<Popover.Content className="max-w-72 p-0">
					<Calendar mode="single" selected={value} onSelect={handleChange} />
				</Popover.Content>
			</Popover.Root>

			<Field.Description description={description} />

			<Field.Error errors={errors} />
		</Field.Root>
	);
};
