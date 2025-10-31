/** biome-ignore-all lint/correctness/useHookAtTopLevel: this one is nested inside a function */
import type { ComponentType } from "react";
import type z from "zod";
import { useFieldContext, useFormContext } from "@/lib/utils/forms.utils";
import type { BaseInputProps } from "../base-field/types";
import { isInputRequired } from "./utils";

const getErrors = (baseErrors: unknown[]) => {
	const errors: string[] = [];

	for (const error of baseErrors) {
		if (error === null || error === undefined) {
			continue;
		}

		if (typeof error === "string") {
			errors.push(error);
			continue;
		}

		if (typeof error === "object") {
			if ("message" in error && typeof error.message === "string") {
				errors.push(error.message);
			}
		}
	}

	return errors;
};

// biome-ignore lint/suspicious/noExplicitAny: need to support any input value
export const FormInputWrapper = <TProps extends BaseInputProps<any>>(
	Input: ComponentType<TProps>,
) => {
	return function Render(props: TProps) {
		const field = useFieldContext();
		const form = useFormContext();

		const showErrors = field.state.meta.isTouched && !field.state.meta.isValid;

		const formSchema = form.options.validators?.onChange as z.ZodObject;
		const isRequired = isInputRequired({ formSchema, fieldName: field.name });

		return (
			<Input
				{...props}
				name={field.name}
				value={field.state.value}
				onChange={(newValue) => field.handleChange(newValue)}
				onBlur={() => field.handleBlur()}
				showErrors={showErrors}
				errors={getErrors(field.state.meta.errors)}
				isRequired={isRequired || props.isRequired}
			/>
		);
	};
};
