import type { ChangeEvent } from "react";
import { cn } from "@/lib/utils/cn";
import { useInputProps } from "../base-field/utils";
import { Field } from "../field";
import { inputBoxClassNames } from "../field/consts";
import type { TextAreaProps } from "./types";

export const TextArea = (props: TextAreaProps) => {
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
		rootClassName,
		isLoading,
	} = useInputProps(props);

	const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		onChange?.(e.target.value);
	};

	return (
		<Field.Root className={rootClassName}>
			<Field.Label htmlFor={id} label={label} isRequired={isRequired} />

			<Field.LoadingContainer isLoading={isLoading} className="h-11 max-h-48">
				<textarea
					className={cn(inputBoxClassNames, "h-11 max-h-48")}
					value={value ?? ""}
					onChange={handleChange}
					onBlur={onBlur}
					placeholder={placeholder}
					{...inputProps}
				/>
			</Field.LoadingContainer>

			<Field.Description description={description} />

			<Field.Error errors={errors} />
		</Field.Root>
	);
};
