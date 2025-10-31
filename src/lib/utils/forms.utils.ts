import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { FormInputWrapper } from "@/lib/components/form-input-wrapper";
import { NumberInput } from "@/lib/components/number-input";
import { SelectInput } from "@/lib/components/select-input";
import { SelectMultipleInput } from "@/lib/components/select-multiple-input";
import { TextArea } from "@/lib/components/text-area-input";
import { TextInput } from "@/lib/components/text-input";
import {
	FormGroup,
	FormLegend,
	FormRoot,
	FormSeparator,
	FormSubmitButton,
} from "../components/form";

export const { formContext, fieldContext, useFieldContext, useFormContext } =
	createFormHookContexts();

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
	formContext,
	fieldContext,
	fieldComponents: {
		TextInput: FormInputWrapper(TextInput),
		SelectInput: FormInputWrapper(SelectInput),
		TextArea: FormInputWrapper(TextArea),
		NumberInput: FormInputWrapper(NumberInput),
		SelectMultipleInput: FormInputWrapper(SelectMultipleInput),
	},
	formComponents: {
		SubmitButton: FormSubmitButton,
		Root: FormRoot,
		Group: FormGroup,
		Legend: FormLegend,
		Separator: FormSeparator,
	},
});
