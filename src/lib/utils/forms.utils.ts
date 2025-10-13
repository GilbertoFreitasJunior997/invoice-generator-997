import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { SubmitButton } from "@/components/submit-button";
import { TextInput } from "@/components/text-input";

export const { formContext, fieldContext, useFieldContext, useFormContext } =
	createFormHookContexts();

export const { useAppForm } = createFormHook({
	formContext,
	fieldContext,
	fieldComponents: {
		TextInput,
	},
	formComponents: {
		SubmitButton,
	},
});
