import type { ChangeEvent } from "react";
import { useInputProps } from "../base-field/utils";
import { Field } from "../field";
import { inputBoxClassNames } from "../field/consts";
import type { TextInputProps } from "./types";

export const TextInput = ({ type, ...props }: TextInputProps) => {
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

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		onChange?.(e?.target?.value);
	};

	return (
		<Field.Root className={rootClassName}>
			<Field.Label htmlFor={id} label={label} isRequired={isRequired} />

			<Field.LoadingContainer isLoading={isLoading}>
				<input
					type={type}
					className={inputBoxClassNames}
					value={value || ""}
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
