import { useFieldContext } from "@/lib/utils/forms.utils";
import { BaseInput } from "../base-input";
import { TextArea } from "../text-area";
import type { TextAreaInputProps } from "./types";

export const TextAreaInput = ({
	textAreaProps,
	...props
}: TextAreaInputProps) => {
	const { disabled } = props;

	const field = useFieldContext<string>();

	return (
		<BaseInput
			{...props}
			children={({ isInvalid }) => {
				return (
					<TextArea
						id={field.name}
						name={field.name}
						value={field.state.value ?? ""}
						onBlur={field.handleBlur}
						onChange={(e) => field.handleChange(e.target.value)}
						aria-invalid={isInvalid}
						aria-disabled={disabled}
						disabled={disabled}
						{...textAreaProps}
					/>
				);
			}}
		/>
	);
};
