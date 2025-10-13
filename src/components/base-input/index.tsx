import type z from "zod";
import { useFieldContext, useFormContext } from "@/lib/utils/forms.utils";
import { Field } from "../field";
import type { BaseInputProps } from "./types";
import { isInputRequired } from "./utils";

export const BaseInput = ({
	label,
	description,
	fieldRootProps,
	fieldLabelProps,
	fieldDescriptionProps,
	fieldErrorProps,
	children,
}: BaseInputProps) => {
	const field = useFieldContext();
	const form = useFormContext();

	const formSchema = form.options.validators?.onChange as z.ZodObject;

	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
	const isRequired = isInputRequired({
		formSchema: formSchema,
		fieldName: field.name,
	});

	return (
		<Field.Root data-invalid={isInvalid} {...fieldRootProps}>
			{!!label && (
				<Field.Label htmlFor={field.name} {...fieldLabelProps}>
					<span className="flex items-center gap-0.5">
						{label}
						{isRequired && <span className="text-destructive">*</span>}
					</span>
				</Field.Label>
			)}

			{children({ isInvalid, isRequired })}

			{!!description && (
				<Field.Description {...fieldDescriptionProps}>
					{description}
				</Field.Description>
			)}

			{isInvalid && (
				<Field.Error errors={field.state.meta.errors} {...fieldErrorProps} />
			)}
		</Field.Root>
	);
};
