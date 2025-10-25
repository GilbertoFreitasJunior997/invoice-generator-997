import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { SelectInput } from "@/lib/components/select-input";
import { SubmitButton } from "@/lib/components/submit-button";
import { TextInput } from "@/lib/components/text-input";

export const { formContext, fieldContext, useFieldContext, useFormContext } =
	createFormHookContexts();

export const { useAppForm } = createFormHook({
	formContext,
	fieldContext,
	fieldComponents: {
		TextInput,
		SelectInput,
	},
	formComponents: {
		SubmitButton,
	},
});
